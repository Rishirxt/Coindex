import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import React from 'react'

interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerRowClassName?: string;
  headerClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

const DataTable = <T,>({ columns, data, rowKey, tableClassName, headerRowClassName, headerClassName, headerCellClassName, bodyRowClassName, bodyCellClassName }: DataTableProps<T>) => {
  return (
    <Table className={cn('custom-scrollbar', tableClassName)}>
      <TableHeader className={headerClassName}>
        <TableRow className={cn('hover:bg-transparent!'
          , headerRowClassName)}>
          {columns.map((column, i) => (
            <TableHead key={i} className={cn('bg-bg-secondary text-purple-100 py-4 first:pl-5 last:pr-5')} scope="col">
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowKey(row, rowIndex)} className={cn('overflow-hidden rounded-2xl border-b border-border/5 hover:bg-muted/50 relative transition-all duration-300',
            bodyRowClassName)}>
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex} className={cn('py-4 first:pl-5 last:pr-5')} scope={columnIndex === 0 ? "row" : undefined}>
                {column.cell(row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable