import { createElement, useEffect, useMemo, useRef } from 'react';
import { useTable, useRowSelect, useFlexLayout } from 'react-table';

import { COLUMN_WIDTH, MAX_COLUMN_WIDTH } from 'config/constants/table/constants';
import { NEXT_PUBLIC_TABLE_VIRTUALIZATION_FEATURE } from 'config/vars';
import useScrollToTop from 'hooks/useScrollToTop';
import isSeeFeatureFlag from 'utils/featureFlag/isSeeFeatureFlag';
import { selectNodeContent } from 'lib/utils/selectNodeContent';
import useSingleAndDoubleClicks from 'hooks/useSingleAndDoubleClicks';
import LoaderSpinner from 'components/ui/atoms/LoaderSpinner';
import TableHead from './components/TableHead';
import TableBodyContentVirtual from './components/TableBodyContentVirtual';
import TableBodyContentBase from './components/TableBodyContentBase';
import { CellMediator, CellType } from './components/Cell';

import { getCellInfo, getClassName, cellProps, getTableRow } from './helpers';
import { Styles } from './styled';
import { ElementName } from './types';

const DataTableBaseReactTable = ({
  data,
  columns,
  options,
  loading,
  onTableClick,
  linkedRow = false,
  withVirtualization = true,
  setSelectedRows,
  cellSpecificInfo,
}) => {
  const parentRef = useRef(null);

  useScrollToTop(parentRef);
  const defaultColumn = useMemo(
    () => ({
      minWidth: 0,
      width: COLUMN_WIDTH,
      maxWidth: MAX_COLUMN_WIDTH,
    }),
    [],
  );

  const TableBody = useMemo(() => {
    return withVirtualization && isSeeFeatureFlag(NEXT_PUBLIC_TABLE_VIRTUALIZATION_FEATURE)
      ? TableBodyContentVirtual
      : TableBodyContentBase;
  }, [withVirtualization]);

  const {
    tableId,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    sortValues,
    handleSort,
    visitedRowId,
    selectedActionContactId,
    pointerEnterHandler,
    pointerLeaveHandler,
    // For bulk actions
    selectedFlatRows,
    toggleAllRowsSelected,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      ...options,
    },
    useFlexLayout,
    useRowSelect,
  );

  const tableClickHandler = (event) => {
    event.stopPropagation();
    const selection = window.getSelection();
    const isSelection = selection.toString();

    if (onTableClick) {
      const cellInfo = getCellInfo(event, rows, columns);

      if (!cellInfo) return;

      onTableClick(event, cellInfo, { selectedFlatRows, toggleAllRowsSelected, isHighlighted: isSelection });
    }
  };

  const onDoubleClick = (event) => {
    const row = getTableRow(event.target);
    selectNodeContent(row);
  };

  const { handleClick, handleDoubleClick } = useSingleAndDoubleClicks({
    onClick: tableClickHandler,
    onDoubleClick,
  });

  useEffect(() => {
    setSelectedRows?.(selectedFlatRows.map((row) => row.original));
  }, [selectedFlatRows]);

  return (
    <Styles>
      <table
        {...getTableProps()}
        id={tableId || 'default-full-table'}
        onClick={handleClick}
        onContextMenu={handleClick}
        onDoubleClick={handleDoubleClick}
        ref={parentRef}
        aria-hidden="true"
        className="table"
        data-table-name={ElementName.Table}
      >
        <TableHead sortValues={sortValues} handleSort={handleSort} headerGroups={headerGroups} />
        {createElement(TableBody, { prepareRow, rows, getTableBodyProps, ref: parentRef }, (row) => {
          return row.cells.map(({ getCellProps, column, value, row: cellRow, render }) => {
            const {
              isSticky,
              value: columnType,
              cellDisplayingType,
              cellDisplayingParams,
              cellType,
              enumName,
              linked: linkedColumn,
              displayFormattedFieldItemProps,
              FormattedControl,
              dataTestId,
            } = column ?? {};

            const isColumnLinked = typeof linkedColumn === 'function' ? linkedColumn(value) : linkedColumn;
            const isLinked =
              cellType !== CellType.Action && cellType !== CellType.BulkAction && (linkedRow || isColumnLinked);

            return (
              <td
                {...getCellProps(cellProps)}
                className={getClassName({
                  isSticky,
                  isLinked,
                  isVisited: visitedRowId === cellRow.original.id,
                  isSelected: row.isSelected,
                  isActionMenuOpen: selectedActionContactId === cellRow.original.id,
                })}
                data-cell-value={columnType}
                data-row-id={cellRow.original.id}
                data-column-id={column.id}
                data-cell-name={ElementName.Cell}
                onPointerEnter={column?.withCellHover ? pointerEnterHandler?.({ row, column }) : null}
                onPointerLeave={column?.withCellHover ? pointerLeaveHandler : null}
              >
                <div className="table-cell-content-wrapper" data-testid={dataTestId}>
                  <CellMediator
                    type={cellType}
                    cellDisplayingType={cellDisplayingType}
                    cellDisplayingParams={cellDisplayingParams}
                    enumName={enumName}
                    value={value}
                    render={render}
                    cellFieldName="Cell"
                    linked={isLinked}
                    getToggleRowSelectedProps={cellRow.getToggleRowSelectedProps}
                    displayFormattedFieldItemProps={displayFormattedFieldItemProps}
                    cellSpecificInfo={cellSpecificInfo}
                    FormattedControl={FormattedControl}
                  />
                </div>
              </td>
            );
          });
        })}
      </table>
      {loading && <LoaderSpinner />}
    </Styles>
  );
};

export default DataTableBaseReactTable;
