import { render, screen } from '@testing-library/react';
import renderWithTheme from '__tests__/helpers/renderWithTheme';
import userEvent from '@testing-library/user-event';

import Autocomplete from 'components/shared/molecules/Autocomplete';

describe('Autocomplete', () => {
  const mockOnChange = jest.fn();
  const mockId = 'autocomplete-test-field';
  const mockLabel = 'Autocomplete';
  const mockPrimaryLabel = 'label';
  const getOptionLabel = (option) => option?.label;

  describe('with default option labels', () => {
    const mockOptions = [
      { label: 'User 1', id: 1 },
      { label: 'User 2', id: 2 },
      { label: 'User 3', id: 3 },
      { label: 'Admin 1', id: 4 },
      { label: 'Admin 2', id: 5 },
      { label: 'Admin 3', id: 6 },
    ];

    test('Should chose the option after clicking', async () => {
      // Arrange
      const mockProps = {
        id: mockId,
        label: mockLabel,
        options: mockOptions,
        onChange: mockOnChange,
        primaryLabel: mockPrimaryLabel,
        getOptionLabel,
      };

      render(renderWithTheme(<Autocomplete {...mockProps} />));
      const input = screen.getByLabelText(mockLabel);
      userEvent.click(input);
      const menuItem = screen.getByText(mockOptions[0].label);

      // Act
      userEvent.click(menuItem);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith({ ...mockOptions[0] });
    });

    test('Should chose the option after typing', async () => {
      // Arrange
      const mockProps = {
        id: mockId,
        label: mockLabel,
        options: mockOptions,
        onChange: mockOnChange,
        primaryLabel: mockPrimaryLabel,
        getOptionLabel,
      };

      render(renderWithTheme(<Autocomplete {...mockProps} />));
      const input = screen.getByLabelText(mockLabel);
      userEvent.type(input, 'Adm');
      const menuItem = screen.getByText(mockOptions[3].label);

      // Act
      userEvent.click(menuItem);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith({ ...mockOptions[3] });
    });
  });

  describe('with custom option labels', () => {
    const mockCustomOptions = [
      { name: 'Jerome Bell', team: 'Team Loan or Die', id: 1 },
      { name: 'Floyd Miles', team: 'Team Mason', id: 2 },
      { name: 'Bessie Cooper', team: 'Team Mason', id: 3 },
      { name: 'Cameron Williamson', team: 'Team FTW', id: 4 },
      { name: 'Devon Lane', team: 'Team Cash or Bust', id: 5 },
      { name: 'Kristin Watson', team: 'Team Loan or Die', id: 6 },
      { name: 'Darrell Steward', team: 'Team Wonderbread', id: 7 },
      { name: 'Eleanor Pena', team: 'Team Dandrew', id: 8 },
      { name: 'Guy Hawkins', team: 'Team Motor City', id: 9 },
      { name: 'Robert Fox', team: 'Team Mason', id: 10 },
    ];
    const mockSecondaryLabel = 'team';

    test('Should chose the option after clicking', async () => {
      // Arrange
      const mockProps = {
        id: mockId,
        label: mockLabel,
        options: mockCustomOptions,
        onChange: mockOnChange,
        secondaryLabel: mockSecondaryLabel,
      };

      render(renderWithTheme(<Autocomplete {...mockProps} />));
      const input = screen.getByLabelText(mockLabel);
      userEvent.click(input);
      const menuItem = screen.getByText(mockCustomOptions[0].name);

      // Act
      userEvent.click(menuItem);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith({ ...mockCustomOptions[0] });
    });

    test('Should chose the option after typing', async () => {
      // Arrange
      const mockProps = {
        id: mockId,
        label: mockLabel,
        options: mockCustomOptions,
        onChange: mockOnChange,
        secondaryLabel: mockSecondaryLabel,
      };

      render(renderWithTheme(<Autocomplete {...mockProps} />));
      const input = screen.getByLabelText(mockLabel);
      userEvent.type(input, 'Darrell');
      const menuItem = screen.getByText(mockCustomOptions[6].name);

      // Act
      userEvent.click(menuItem);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith({ ...mockCustomOptions[6] });
    });
  });
});
