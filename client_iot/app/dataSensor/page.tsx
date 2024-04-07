"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Select, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Input } from "antd";
import axios from "axios";
import { SorterResult } from "antd/es/table/interface";
import { Dayjs } from "dayjs";
import type { SearchProps } from "antd/es/input";

const { Search } = Input;

interface DataType {
  id: React.Key;
  temp: number;
  hum: number;
  light: number;
  createdAt: string;
}

export const SearchType = {
  ALL: "all",
  TEMP: "temp",
  HUM: "hum",
  LIGHT: "light",
};

const DataSensor = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng phần tử mỗi trang
  const [dataTemp, setDataTemp] = useState([]);
  const [totalItem, setTotalItem] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const [params, setParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    startDate: "",
    endDate: "",
    search: "",
    category: "",
    sort: "",
  });

  const [newColumns, setNewColumns] = useState<TableColumnsType<DataType>>([
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: "200px",
    },
    {
      title: "Temperature",
      dataIndex: "temp",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Humidity",
      dataIndex: "hum",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Light",
      dataIndex: "light",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      sorter: {},
      align: "center",
      width: "200px",
    },
  ]);

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: "200px",
    },
    {
      title: "Temperature",
      dataIndex: "temp",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Humidity",
      dataIndex: "hum",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Light",
      dataIndex: "light",
      sorter: {},
      align: "center",
      width: "200px",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      sorter: {},
      align: "center",
      width: "200px",
    },
  ];

  const onChangeStartDate: DatePickerProps["onChange"] = async (
    date,
    dateString
  ) => {
    setStartDate(date);
    setParams({
      ...params,
      startDate: dateString as string,
    });
  };

  const onChangeEndDate: DatePickerProps["onChange"] = async (
    date,
    dateString
  ) => {
    setEndDate(date);
    setParams({
      ...params,
      endDate: dateString as string,
    });
  };

  const disabledEndDate = (current: Dayjs | null) => {
    if (!startDate || !current) {
      return false;
    }
    return current < startDate.startOf("day");
  };

  const handleSelectChange = (value: string) => {
    setCategory(value);
    setParams({
      ...params,
      category: value,
    });

    // if (value === "all") {
    //   setNewColumns(columns); // Giữ nguyên danh sách cột ban đầu
    // } else if (value === "temp") {
    //   // Lọc danh sách cột dựa trên giá trị được chọn
    //   setNewColumns(
    //     columns.filter(
    //       (column) => column.title !== "Humidity" && column.title !== "Light"
    //     )
    //   );
    // } else if (value === "hum") {
    //   setNewColumns(
    //     columns.filter(
    //       (column) => column.title !== "Temperature" && column.title !== "Light"
    //     )
    //   );
    // } else {
    //   setNewColumns(
    //     columns.filter(
    //       (column) =>
    //         column.title !== "Humidity" && column.title !== "Temperature"
    //     )
    //   );
    // }
  };

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", sorter);

    const sort = sorter as SorterResult<DataType>;

    const sortString =
      sort.order === "ascend"
        ? sort.field?.toString()
        : "-" + sort.field?.toString();

    setSort(sortString);
    setParams({
      ...params,
      sort: sortString,
    });
  };

  const onChangePag: PaginationProps["onChange"] = async (page, pageSize) => {
    setCurrentPage(page);
    setParams({
      ...params,
      pageNumber: page,
    });
  };

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    console.log(value)
    console.log(params);
    
    const response = await axios.get("http://localhost:4000/api/dataSensor", {
        params: {...params, search: value},
      });
    setDataTemp(response.data.data);
    setTotalItem(response.data.totalData);
    
  }

  useEffect(() => {
    const fetchDataSensor = async () => {
      const response = await axios.get("http://localhost:4000/api/dataSensor", {
        params: params,
      });
      setDataTemp(response.data.data);
      setTotalItem(response.data.totalData);
      console.log(response.data);
    };
    fetchDataSensor();
  }, [endDate, currentPage, sort, currentPage, itemsPerPage]);

  return (
    <>
      <Header />
      <div className="flex justify-center pt-[50px] gap-4">
        <Space direction="horizontal">
          <div className="mr-2">Start date</div>

          <DatePicker onChange={onChangeStartDate} allowClear={false} />
        </Space>

        <Space direction="horizontal">
          <div className="mr-2">End date</div>

          <DatePicker
            onChange={onChangeEndDate}
            disabledDate={disabledEndDate}
            disabled={startDate === null}
            allowClear={true}
          />
        </Space>

        <div className="flex items-center">
          <div className="mr-2">Category</div>

          <Select
            defaultValue="All"
            style={{ width: 120 }}
            onChange={handleSelectChange}
            options={[
              { value: "all", label: "All" },
              { value: "temp", label: "Temperature" },
              { value: "hum", label: "Himidity" },
              { value: "light", label: "Light" },
            ]}
          />
        </div>

        <Search placeholder="Search...." onSearch={onSearch} enterButton className="w-[250px] activeBg-[#000000]"/>
      </div>
      <Table
        className="flex justify-center pt-[50px] pb-[20px] px-[40px]"
        columns={newColumns}
        dataSource={dataTemp as DataType[]}
        onChange={onChange}
        bordered={true}
        size={"middle"}
        pagination={false}
      />
      <Pagination
        className="flex justify-center"
        defaultCurrent={1}
        total={totalItem}
        onChange={onChangePag}
      />
    </>
  );
};

export default DataSensor;
