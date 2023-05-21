import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import {screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import run from '../src/application.js';

let companies;

beforeEach(() => {
  companies = [
    { id: 1, name: 'Hexlet', description: 'online courses' },
    { id: 2, name: 'Google', description: 'search engine' },
    { id: 3, name: 'Facebook', description: 'social network' },
  ];

  const initHtml = fs.readFileSync(path.join('__fixtures__', 'index.html')).toString();
  document.body.innerHTML = initHtml;
  run(companies);
});

test('working process', async () => {
  const company1 = companies[0];
  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).toHaveTextContent(company1.description);
  });

  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).not.toHaveTextContent(company1.description);
  });

  const company2 = companies[1];
  await userEvent.click(screen.getByText(company2.name));
  await waitFor(() => {
    expect(document.body).toHaveTextContent(company2.description);
  });

  // button 1
  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).toHaveTextContent(company1.description);
  });

  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).not.toHaveTextContent(company2.description);
  });

  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).toHaveTextContent(company1.description);
  });

  await userEvent.click(screen.getByText(company1.name));
  await waitFor(() => {
    expect(document.body).not.toHaveTextContent(company1.description);
  });

  const company3 = companies[2];
  await userEvent.click(screen.getByText(company3.name));
  await waitFor(() => {
    expect(document.body).toHaveTextContent(company3.description);
  });

  await userEvent.click(screen.getByText(company3.name));
  await waitFor(() => {
    expect(document.body).not.toHaveTextContent(company3.description);
  });
});

test('initial state', async () => {
  companies.forEach((c) => {
    expect(document.body).not.toHaveTextContent(c.description);
  });

  companies.forEach((c) => {
    expect(document.body).toHaveTextContent(c.name);
  });
});
