import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  test
} from 'node:test';

import { chromium } from 'playwright';
import type { Page } from 'playwright';
import { expect } from '@playwright/test';

import type { TestContext, SuiteContext } from 'node:test';

const TEST_TO_PAGE = new WeakMap<TestContext | SuiteContext, Page>();
let browser = null;
before(async () => {
  browser = await chromium.launch();
});

after(async () => {
  await browser.close();
});

beforeEach(async (testContext) => {
  const page = await browser.newPage();
  TEST_TO_PAGE.set(testContext, page);
});

afterEach(async (testContext) => {
  await TEST_TO_PAGE.get(testContext).close();
});

describe('Without AgentQL', () => {
  test('get started link', async (testContext) => {
    const page = TEST_TO_PAGE.get(testContext);
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole('heading', { name: 'Installation' })
    ).toBeVisible();
  });

  test('should allow to add a TODO item', async (testContext) => {
    const page = TEST_TO_PAGE.get(testContext);
    await page.goto('https://demo.playwright.dev/todomvc');
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill('Use AgentQL');
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText('Use AgentQL');

    // Create 2nd todo.
    await newTodo.fill('Use Heal.dev');
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      'Use AgentQL',
      'Use Heal.dev'
    ]);
  });
});
