import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from ".";

test('it renders correctly', async () => {
  render(<Async />);

  expect(screen.getByText('Hello World')).toBeInTheDocument();
  // expect(await screen.findByText('Button', {}, {timeout: 2000})).toBeInTheDocument();
  
  // await waitForElementToBeRemoved(screen.queryByText('Button'));

  await waitFor(() => {
    expect(screen.getByText('Button')).toBeInTheDocument();
  }, {timeout: 3000})
  
})