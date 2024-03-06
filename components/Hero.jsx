import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Chip,
  Switch,
  cn,
  Progress,
  Card,
  CardBody,
} from "@nextui-org/react";

import { useState, useMemo, useEffect } from "react";
export default () => {
  const [addressList, setAddressList] = useState();

  const [result, setResult] = useState({
    response: [],
  });
  const ChangeAddressList = (event) => {
    setAddressList(event.target.value);
  };

  const [countCheck, setCountCheck] = useState(0);
  let [eligibleAddress, setEligibleAddress] = useState(0);
  const [amountEligible, setAmountEligible] = useState(0);

  useEffect(() => {
    setRows(result.response);
    let res = result.response;
    if (res.length > 0) {
      let last = res.reverse()[0].key + 1;
      setValue((last / countCheck) * 100);
    }
  }, [result.response]);

  const [isSelected, setIsSelected] = useState(false);

  const [rows, setRows] = useState([]);
  const [raw, setRaw] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  function validateInputAddresses(address) {
    return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
  }

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isSelected == true) {
      setRaw(result.response);
      let newItem = result.response.filter(function (jsonObject) {
        return jsonObject.elig != false;
      });

      if (newItem.length > 0 && newItem !== undefined) {
        setRows(newItem);
      } else {
        setRows([]);
      }
    } else {
      setRows(raw);
    }
  }, [isSelected]);

  const doCheck = async (e) => {
    e.preventDefault();
    setValue(0);

    setResult((previousInputs) => ({
      ...previousInputs,
      response: [],
    }));
    try {
      let address = addressList.split("\n");

      console.log(address);
      if (address.length > 0) {
        setCountCheck(address.length);
        let tokenAmount = 0;
        for (let i = 0; i < address.length; i++) {
          //  console.log(Math.floor(i / countCheck) * 100);

          if (validateInputAddresses(address[i])) {
            try {
              let data = await axios.get(`/api/check?address=${address[i]}`);
              console.log(data.data);
              let result = data.data;
              if (data.data.status === 200) {
                setResult((previousInputs) => ({
                  ...previousInputs,
                  response: [
                    ...previousInputs.response,
                    {
                      key: i,
                      address: address[i],
                      status: (
                        <Chip
                          className="capitalize"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          Eligible
                        </Chip>
                      ),
                      elig: true,
                      amount: Number(result.data.amount / 1e9).toFixed(2),
                    },
                  ],
                }));

                //console.log(;
                setEligibleAddress((eligibleAddress += 1));
                setAmountEligible(
                  Math.floor((tokenAmount += Number(result.data.amount / 1e9)))
                );
              } else {
                setResult((previousInputs) => ({
                  ...previousInputs,
                  response: [
                    ...previousInputs.response,
                    {
                      key: i,
                      address: address[i],
                      status: (
                        <Chip
                          className="capitalize"
                          color="danger"
                          size="sm"
                          variant="flat"
                        >
                          Not Eligible
                        </Chip>
                      ),
                      amount: 0,
                      elig: false,
                    },
                  ],
                }));
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    } catch (err) {}
  };

  const tableItems = result.response;

  return (
    <>
      <section className="mt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8 flex justify-center items-center ">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 text-center sm:text-center lg:text-left">
          <h2 className="text-white font-bold text-3xl xl:text-4xl">
            Wormhole Crypto
          </h2>
          <span></span>

          <p className="text-gray-300 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            Wormhole Crypto EVM Airdrop Checker| Powered By DMH
          </p>
        </div>

        <div
          className="absolute inset-0 m-auto max-w-xl h-[500px] blur-[200px] sm:max-w-md md:max-w-lg"
          style={{
            background:
              "linear-gradient(200deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
      </section>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-20 md:px-8 bg-black bg-opacity-40">
        <form>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Address List
              </label>
              <textarea
                id="comment"
                rows={12}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter wallet in separate list"
                required=""
                defaultValue={addressList}
                onChange={ChangeAddressList}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                onClick={doCheck}
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              >
                Check Address
              </button>
              <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2"></div>
            </div>
          </div>
        </form>
        <div className="mb-3">
          {value > 0 ? (
            <Progress
              aria-label="Checking..."
              size="lg"
              value={value}
              color="success"
              showValueLabel={true}
              className="max-w-screen"
            />
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-20 md:px-8 bg-black bg-opacity-70 -mt-12">
        <div className="mb-3 -mt-7">
          <Switch
            isSelected={isSelected}
            onValueChange={setIsSelected}
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                "data-[selected=true]:border-success"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-success",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4"
              ),
            }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Eligible Only</p>
              <p className="text-tiny text-default-400">
                Switch to show eligible address only
              </p>
            </div>
          </Switch>
        </div>
        <Card className="mb-3">
          <CardBody>
            <p>
              Total Address :{" "}
              <Chip
                className="capitalize"
                color="success"
                size="sm"
                variant="flat"
              >
                {countCheck}
              </Chip>{" "}
              | Total Eligible Address :{" "}
              <Chip
                className="capitalize"
                color="success"
                size="sm"
                variant="flat"
              >
                {eligibleAddress}
              </Chip>
              | Total Token Amount
              <Chip
                className="capitalize"
                color="success"
                size="sm"
                variant="flat"
              >
                {amountEligible}
              </Chip>
            </p>
          </CardBody>
        </Card>

        <Table
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="address">Address</TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn key="amount">Amount</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
