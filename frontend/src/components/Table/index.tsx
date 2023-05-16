import { useEffect, useState } from "react";
import { ButtonContainer, TableBody, TableButton, TableContainer, TableHeader } from "./styles";
import axios from "axios";

export function Table() {
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setTableData(response.data);
    } catch (error) {
      console.error("Ocorreu um erro ao obter os dados do backend:", error);
    }
  };

  return (
    <div>
      <TableContainer>
        <TableHeader>
          <tr>
            <th>Codigo</th>
            <th>Nome</th>
            <th>Preço Custo</th>
            <th>Preço Venda</th>
          </tr>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.code}</td>
              <td>{row.name}</td>
              <td>{row.costPrice}</td>
              <td>{row.salesPrice}</td>
            </tr>
          ))}
        </TableBody>
      </TableContainer>
      <ButtonContainer>
        <TableButton>Atualizar</TableButton>
      </ButtonContainer>
    </div>
  );
}
