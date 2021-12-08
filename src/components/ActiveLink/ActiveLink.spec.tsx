import { render } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('<ActiveLink />', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toBeInTheDocument();
  })
  
  it('add active class if the link as currently active', () => {
    const {getByText} = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toHaveClass('active')
  })
  
  it('not have class if the link is not currently active', () => {
    const {getByText} = render(
      <ActiveLink href="/pages" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).not.toHaveClass('active')
  })
})
