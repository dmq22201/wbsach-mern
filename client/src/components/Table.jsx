import { createContext, useContext } from "react";

const TableContext = createContext();

function Table({ isActions, children }) {
  return (
    <TableContext.Provider value={{ isActions }}>
      <table className="text-sm dark:border-slate-600">{children}</table>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { isActions } = useContext(TableContext);
  return (
    <thead className="dark:bg-slate-700">
      <tr>
        {children}
        {isActions && <th className="p-2 text-left">Thực hiện</th>}
      </tr>
    </thead>
  );
}

function HeaderName({ children }) {
  return <th className="p-2 text-left">{children}</th>;
}

function Body({ children }) {
  return <tbody>{children}</tbody>;
}

function BodyRow({ rowData, children }) {
  const { isActions } = useContext(TableContext);

  const newRowData = {
    address: rowData.address,
    phoneNumber: rowData.phoneNumber,
  };

  return (
    <tr className="">
      {Object.keys(newRowData).map((objKey) => (
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
