import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should render button with default variant', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('.ds-button');
    expect(button).toHaveClass('ds-button--primary');
  });

  it('should apply variant class correctly', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    const button = container.querySelector('.ds-button');
    expect(button).toHaveClass('ds-button--secondary');
  });

  it('should apply size class correctly', () => {
    const { container } = render(<Button size="lg">Test</Button>);
    const button = container.querySelector('.ds-button');
    expect(button).toHaveClass('ds-button--lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('ds-button--disabled');
  });

  it('should apply fullWidth class when fullWidth prop is true', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    const button = container.querySelector('.ds-button');
    expect(button).toHaveClass('ds-button--full-width');
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with icon on left', () => {
    const { container } = render(
      <Button icon={<span data-testid="icon">Icon</span>} iconPosition="left">
        With Icon
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    const icon = container.querySelector('.ds-button__icon');
    expect(icon).toBeInTheDocument();
  });

  it('should render with icon on right', () => {
    const { container } = render(
      <Button icon={<span data-testid="icon">Icon</span>} iconPosition="right">
        With Icon
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    const button = container.querySelector('.ds-button');
    expect(button).toHaveClass('custom-class');
  });

  it('should set button type correctly', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should pass through additional props', () => {
    render(<Button data-testid="custom-button" aria-label="Custom">Test</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom');
  });
});


