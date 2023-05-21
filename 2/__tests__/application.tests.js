import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import  { screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import run from '../src/application.js';

const tasksList = () => screen.getByRole('list', { name: 'Tasks' });

const initialData = { items: [] };

Polly.register(NodeHttpAdapter);
let data;
let polly;

beforeAll(() => {
  polly = new Polly('rest api', {
    adapters: ['node-http'], // Hook into `fetch`
    mode: 'passthrough',
    flushRequestsOnStop: true,
    logLevel: 'warn',
  });

  const { server } = polly;
  server
    .get('http://localhost/api/tasks')
    .intercept((req, res) => {
      res.status(200).json(data);
    });
  server
    .post('http://localhost/api/tasks')
    .intercept((req, res) => {
      data.items.unshift(JSON.parse(req.body));
      res.status(201).json({ message: 'Success!' });
    });
  server
    .get('http://localhost/*')
    .intercept((req, res) => {
      res.status(404);
      // eslint-disable-next-line
      console.error(
        'Found an unhandled %s request to %s',
        req.method,
        req.url,
      );
    });
});

afterAll(async () => {
  await polly.stop();
});

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join('__fixtures__', 'index.html')).toString();
  document.body.innerHTML = initHtml;
  data = initialData;
});

test('backend with tasks', async () => {
  const task1 = { name: 'task one' };
  const task2 = { name: 'task two' };
  data = { items: [task1, task2] };
  await run();

  const { getAllByRole } = within(tasksList());
  const items = getAllByRole('listitem');
  const list = items.map((item) => item.textContent);

  expect(list).toEqual(['task one', 'task two']);
  items.forEach((item) => expect(item).toHaveClass('list-group-item'));
});

test('working process', async () => {
  await run();

  const submit = await screen.findByRole('button', { name: /add/i });
  const input = await screen.findByRole('textbox');

  await userEvent.type(input, 'new task');
  await userEvent.click(submit);

  await waitFor(() => {
    const { getAllByRole } = within(tasksList());
    const items = getAllByRole('listitem');
    const list = items.map((item) => item.textContent);

    expect(list).toEqual(['new task']);
    expect(data.items[0]).toEqual({ name: 'new task' });
  });

  await userEvent.clear(input);
  await userEvent.type(input, 'another task');
  await userEvent.click(submit);

  await waitFor(() => {
    const { getAllByRole } = within(tasksList());
    const items = getAllByRole('listitem');
    const list = items.map((item) => item.textContent);

    expect(list).toEqual(['another task', 'new task']);
    expect(data.items[0]).toEqual({ name: 'another task' });
    items.forEach((item) => expect(item).toHaveClass('list-group-item'));
  });
});
