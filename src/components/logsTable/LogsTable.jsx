import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { getLogsData } from "../../commonServices";
import { Toolbar } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function LogsTable() {
  const navigate = useNavigate();
  const [data, setData] = React.useState([
    {
      operation: "POST",
      updatedAt: "2023-01-23",
    },
  ]);

  useEffect(async () => {
    const username = localStorage.getItem("username");
    if (!username) navigate('/')
    // const res = await getLogsData();
    // setData(res.data)
  }, []);

  const onHomeClick = () => {
    navigate("/imageUploader");
  };


  return (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '5em'}}>
      <TableContainer component={Paper} sx={{maxWidth: 650}}>
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <h1>User Logs</h1>
          <Button variant="contained" onClick={onHomeClick}>
            Home
          </Button>
        </Toolbar>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Operation</b>
              </TableCell>
              <TableCell align="right">
                <b>Updated At</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.updateAt}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.operation === "POST" ? "Image Added" : "Image Deleted"}
                </TableCell>
                <TableCell align="right">{row.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
