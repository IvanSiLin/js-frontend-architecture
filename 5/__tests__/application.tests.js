import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen }  from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import run from '../src/application.js';

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join('__fixtures__', 'index.html')).toString();
  document.body.innerHTML = initHtml;
  run();
});

test('application', async () => {
  const task1 = 'First Task in General';
  await userEvent.type(screen.getByLabelText(/new task name/i), task1);
  expect(screen.getByLabelText(/new task name/i)).toHaveDisplayValue(task1);
  await userEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByLabelText(/new task name/i)).toHaveDisplayValue('');
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task1));

  const task2 = 'Second Task in General';
  await userEvent.clear(screen.getByLabelText(/new task name/i));
  await userEvent.type(screen.getByLabelText(/new task name/i), task2);
  expect(screen.getByLabelText(/new task name/i)).toHaveDisplayValue(task2);
  await userEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByLabelText(/new task name/i)).toHaveDisplayValue('');
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task2));

  const list1 = 'Random';
  await userEvent.clear(screen.getByLabelText(/new task name/i));
  await userEvent.type(screen.getByRole('textbox', { name: /new list name/i }), list1);
  expect(screen.getByRole('textbox', { name: /new list name/i })).toHaveDisplayValue(list1);
  await userEvent.click(screen.getByRole('button', { name: /add list/i }));
  expect(screen.getByRole('textbox', { name: /new list name/i })).toHaveDisplayValue('');

  await userEvent.clear(screen.getByRole('textbox', { name: /new list name/i }));
  await userEvent.type(screen.getByRole('textbox', { name: /new list name/i }), list1);

  await userEvent.click(screen.getByRole('button', { name: /add list/i }));
  expect(screen.getAllByRole('textbox', { name: /new list name/i })).toHaveLength(1);

  expect(screen.getByRole('link', { name: list1 })).toBeInTheDocument();
  expect(document.querySelector('[data-container="lists"]')).toContainElement(screen.getByText(list1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task2));

  await userEvent.click(screen.getByText(list1));

  expect(screen.queryByRole('link', { name: list1 })).not.toBeInTheDocument();
  expect(document.querySelector('[data-container="tasks"]')).toBeEmptyDOMElement();

  const task3 = 'Task in Random';
  await userEvent.clear(screen.getByLabelText(/new task name/i));
  await userEvent.type(screen.getByLabelText(/new task name/i), task3);
  await userEvent.click(screen.getByRole('button', { name: /add task/i }));

  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task3));

  await userEvent.click(screen.getByRole('link', { name: /general/i }));

  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task2));

  await userEvent.click(screen.getByText(list1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task3));

  await userEvent.click(screen.getByRole('link', { name: /general/i }));

  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task1));
  expect(document.querySelector('[data-container="tasks"]')).toContainElement(screen.getByText(task2));
});

test('fresh application', () => {
  expect(document.querySelector('[data-container="tasks"]')).toBeEmptyDOMElement();
  expect(document.querySelector('[data-container="lists"]')).toContainElement(screen.getByRole('listitem'));
}); 