import { useState } from "react";
import { Header } from "../../components/Header";
import { Table } from "../../components/Table";

export function RefreshPrices() {
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (file: File) => {
    // Perform file upload logic here

    setFileUploaded(true);
  };

  return (
    <div>
      <Header onFileUpload={handleFileUpload} />
      {fileUploaded && <Table />}
    </div>
  );
}
