import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  test
} from 'node:test';
import * as AgentQL from 'agentql';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

import type { PageExt } from 'agentql';
import type { TestContext, SuiteContext } from 'node:test';
import * as Assert from 'node:assert';

const TEST_TO_PAGE = new WeakMap<TestContext | SuiteContext, PageExt>();
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

describe('With AgentQL', () => {
  beforeEach(async (testContext) => {
    const page = TEST_TO_PAGE.get(testContext);
    const pageExt = await AgentQL.wrap(page);
    TEST_TO_PAGE.set(testContext, pageExt);
  });

  test('get started link', async (testContext) => {
    const page = TEST_TO_PAGE.get(testContext);
    await page.goto('https://playwright.dev/');

    // Find the locator by prompt
    const getStartedLink = await page.getByPrompt('Get started link');

    // Click the get started link.
    await getStartedLink.click();

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole('heading', { name: 'Installation' })
    ).toBeVisible();
  });

  test('should allow to add a TODO item', async (testContext) => {
    const page = TEST_TO_PAGE.get(testContext);
    await page.goto('https://demo.playwright.dev/todomvc');
    const newTodo = await page.getByPrompt('Entry to add todo items');

    // Create 1st todo.
    await newTodo.fill('Use AgentQL');
    await newTodo.press('Enter');

    const todoItemsQuery = `{
  todo_items[]
}`;

    // Make sure the list only has one todo item.
    const { todo_items: itemsBefore } = await page.queryData(todoItemsQuery);
    Assert.deepStrictEqual(itemsBefore, ['Use AgentQL']);

    // Create 2nd todo.
    await newTodo.fill('Use Heal.dev');
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    const { todo_items: itemsAfter } = await page.queryData(todoItemsQuery);
    Assert.deepStrictEqual(itemsAfter, ['Use AgentQL', 'Use Heal.dev']);
  });
});
