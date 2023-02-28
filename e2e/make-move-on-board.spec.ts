import { test, expect } from '@playwright/test'

test('bottom player plays first', async ({ page }) => {
  await page.goto('/')
  const bottomDice = page.getByTestId('bottom-board').getByTestId('dice')
  // Expect a title "to contain" a substring.
  await expect(bottomDice).toHaveText(/roll/i)
  bottomDice.click()
  await expect(bottomDice).not.toHaveText(/roll/i)
  const diceValue = await bottomDice.getAttribute('aria-label') as string
  const firstPosition = page.getByTestId('bottom-board').getByTestId('0-0')
  await firstPosition.click()
  await expect(firstPosition).toHaveText(diceValue)
})
