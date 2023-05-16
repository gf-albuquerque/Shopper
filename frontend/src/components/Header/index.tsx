import { useState } from "react";
import { HeaderContainer, HeaderContent, UploadCSVButton } from "./styles";
import logoImg from "../../assets/logo.svg";
import axios from 'axios';

interface HeaderProps {
  onFileUpload: (file: File) => void;
}

export function Header({ onFileUpload }: HeaderProps) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Obtém o arquivo selecionado pelo usuário

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:3000/upload', formData);
        console.log('Arquivo enviado com sucesso!');

        // Limpar o conteúdo do input
        event.target.value = '';
        onFileUpload(file); // Chamar a função onFileUpload passando o arquivo
      } catch (error) {
        console.error('Ocorreu um erro ao enviar o arquivo:', error);
      }
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="Logo" />
        <UploadCSVButton>
          Selecione o CSV:
          <input type="file" onChange={handleFileUpload} />
        </UploadCSVButton>
      </HeaderContent>
    </HeaderContainer>
  );
}
