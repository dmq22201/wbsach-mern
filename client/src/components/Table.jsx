import { createContext, useContext } from "react";

const TableContext = createContext();

function Table({ isActions, children }) {
  return (
    <TableContext.Provider value={{ isActions }}>
      <table className="w-full text-sm dark:border-slate-600">{children}</table>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { isActions } = useContext(TableContext);
  return (
    <thead className="border dark:border-slate-700 dark:bg-slate-700">
      <tr>
        {children}
        {isActions && (
          <th className="p-2 text-left font-semibold uppercase">Thực hiện</th>
        )}
      </tr>
    </thead>
  );
}

function HeaderName({ children }) {
  return <th className="p-2 text-left font-semibold uppercase">{children}</th>;
}

function Body({ children }) {
  return <tbody>{children}</tbody>;
}

function BodyRow({ rowData, children }) {
  const { isActions } = useContext(TableContext);

  return (
    <tr>
      {Object.keys(rowData).map((objKey) => (
        <td className="border p-2 dark:border-slate-700" key={objKey}>
          {rowData[objKey]}
        </td>
      ))}
      {isActions && (
        <td className="border p-2 dark:border-slate-700">{children}</td>
      )}
    </tr>
  );
}

Table.Header = Header;
Table.HeaderName = HeaderName;
Table.Body = Body;
Table.BodyRow = BodyRow;
export default Table;
