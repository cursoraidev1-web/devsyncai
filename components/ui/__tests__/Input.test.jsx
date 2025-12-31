import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Input label="Email" required />);
    const label = screen.getByText('Email');
    const required = label.querySelector('.ds-input-required');
    expect(required).toBeInTheDocument();
    expect(required).toHaveTextContent('*');
  });

  it('should display error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('ds-input-error');
  });

  it('should display helper text when helperText prop is provided', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address')).toHaveClass('ds-input-helper');
  });

  it('should not display helper text when error is present', () => {
    render(<Input error="Error" helperText="Helper" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('should apply error class when error prop is provided', () => {
    const { container } = render(<Input error="Error" />);
    const input = container.querySelector('.ds-input');
    expect(input).toHaveClass('ds-input--error');
  });

  it('should render with icon on left', () => {
    const { container } = render(
      <Input icon={<span data-testid="icon">Icon</span>} iconPosition="left" />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    const icon = container.querySelector('.ds-input-icon--left');
    expect(icon).toBeInTheDocument();
  });

  it('should render with icon on right', () => {
    const { container } = render(
      <Input icon={<span data-testid="icon">Icon</span>} iconPosition="right" />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    const icon = container.querySelector('.ds-input-icon--right');
    expect(icon).toBeInTheDocument();
  });

  it('should apply size class correctly', () => {
    const { container } = render(<Input size="lg" />);
    const input = container.querySelector('.ds-input');
    expect(input).toHaveClass('ds-input--lg');
  });

  it('should apply fullWidth class by default', () => {
    const { container } = render(<Input />);
    const wrapper = container.querySelector('.ds-input-wrapper');
    expect(wrapper).toHaveClass('ds-input-wrapper--full-width');
  });

  it('should set input type correctly', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('.ds-input');
    expect(input).toHaveClass('custom-class');
  });

  it('should pass through additional props', () => {
    render(<Input placeholder="Enter text" data-testid="custom-input" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('data-testid', 'custom-input');
  });
});


