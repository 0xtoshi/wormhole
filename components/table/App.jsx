import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";

//import { columns, users } from "./data";

const statusColorMap = {
  elig: "success",
  inelig: "danger",
};

export default function AppTable(props) {
  const columns = [
    { name: "Address", uid: "address" },
    { name: "Status", uid: "status" },
    { name: "Amount", uid: "amount" },
  ];

  React.useEffect(() => {
    let data = props.data;
    if (data.length > 0) {
      setAddress(props.data);
    }
  }, [props]);
  const [setAddress, addresses] = React.useState([]);

  console.log(addresses);
  const renderCell = React.useCallback((address, columnKey) => {
    const cellValue = address[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: address.avatar }}
            description={address.email}
            name={cellValue}
          >
            {address.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {address.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[address.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      {addresses.length > 1 ? (
        <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={addresses}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        ""
      )}
    </>
  );
}
