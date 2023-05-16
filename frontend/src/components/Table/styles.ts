import styled from "styled-components";

export const TableContainer = styled.table`
  background: ${(props) => props.theme["blue-700"]};
  color: ${(props) => props.theme["white"]};
  margin: 4rem auto 0;
  padding: 2rem 2rem 5rem;
  width: 100%;
  max-width: 1120px;
  border-radius: 8px;
  border-collapse: separate;
  border-spacing: 0 0.7rem;
`;

export const TableHeader = styled.thead`
  text-align: center;
`;

export const TableBody = styled.tbody`
  background: ${(props) => props.theme["blue-500"]};
  text-align: center;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 1rem auto;
  padding: 0 1.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TableButton = styled.button`
  height: 50px;
  border: 0;
  background: ${(props) => props.theme["green-500"]};
  color: ${(props) => props.theme["white"]};
  font-weight: bold;
  padding: 0 1.25rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme["green-700"]};
    transition: background-color 0.2s;
  }
`;
