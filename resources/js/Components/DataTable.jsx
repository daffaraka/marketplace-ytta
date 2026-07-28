import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function DataTable({ columns, data, searchPlaceholder = "Cari data...", title }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
      {/* Search Bar & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-gray-100 gap-4">
        {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
        <div className="relative w-full max-w-sm ml-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors font-medium"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100 border-b border-gray-200 text-sm text-gray-600">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-4 px-6 font-bold uppercase tracking-wider ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-200 transition' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          {{
                            asc: <ChevronUp className="w-3 h-3 text-blue-600 font-bold" />,
                            desc: <ChevronDown className="w-3 h-3 text-blue-600 font-bold" />,
                          }[header.column.getIsSorted()] ?? (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 even:bg-gray-50 hover:bg-blue-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-6 text-gray-800 font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-500 font-medium">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-600">Tampilkan</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="border border-gray-200 rounded-lg text-sm font-medium focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8 bg-gray-50 cursor-pointer"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 font-medium">
            (Total {table.getPrePaginationRowModel().rows.length} baris)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronsLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <span className="text-sm font-bold text-gray-700 mx-2 bg-gray-100 px-3 py-1 rounded-md">
            Hal {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronsRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
