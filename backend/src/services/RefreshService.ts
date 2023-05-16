import { Readable } from "stream";
import readline from "readline";
import { client } from "../database/client";
import { GetProductsService } from "./GetProductsService";

export class RefreshService {
  async refresh(buffer: Buffer) {
    const readableFile = new Readable();
    const getService = new GetProductsService();
    const productsRepo = client.products;
    const packsRepo = client.packs;
    readableFile.push(buffer);
    readableFile.push(null);

    const productsLine = readline.createInterface({
      input: readableFile,
    });

    let isFirstLine = true;

    for await (let line of productsLine) {
      //recurso utilizado para pular a primeira linha do arquivo CSV enviado para o desafio pois a primeira linha diz respeito aos nomes das colunas
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }

      const split = line.split(",");
      const productCode = Number(split[0]);
      const newPrice = Number(split[1]);

      const existingProduct = await productsRepo.findFirst({
        where: { code: productCode },
      });

      const existingPack = await packsRepo.findFirst({
        where: {
          pack_id: productCode,
        },
      });

      const existingProductInPack = await packsRepo.findFirst({
        where: {
          product_id: existingProduct?.code,
        },
      });

      const pack = await productsRepo.findFirst({
        where: {
          code: existingPack?.pack_id,
        },
      });

      // Verifica se a linha é um pacote ou produto
      if (existingPack) {
        // Verifica se o novo preço é maior que o preço de custo
        if (newPrice > Number(pack?.costPrice)) {
          // Verifica se o novo preço está dentro da margem de 10%
          if (
            newPrice <= Number(pack?.salesPrice) * 1.1 &&
            newPrice >= Number(pack?.salesPrice) * 0.9
          ) {
            // Verifica se o produto do pacote está no restante do arquivo
            if (
              await this.checkProductInFile(
                Number(existingPack.product_id),
                productsLine
              )
            ) {
              // Verifica se o preço unitario do produto condiz com a equação (novopreçoPkt / qtdNoPacote)
              // if (
              //   await this.checkProductPriceInFile(
              //     Number(pack?.code),
              //     productsLine
              //   )
              // ) {
              //   await client.products.update({
              //     where: { code: productCode },
              //     data: { salesPrice: newPrice },
              //   });
              //   return client.products;
              // } else {
              //   throw new Error(
              //     "O novo preço do produto no pacote não condiz com o cálculo correto."
              //   );
              // }
            } else {
              throw new Error(
                "Falta as informações referentes ao produto do pacote no arquivo CSV."
              );
            }
          } else {
            throw new Error(
              "A mudança no preço do pacote não pode ser maior ou menor que 10% do preço atual."
            );
          }
        } else {
          throw new Error(
            "O Preço de venda do pacote não pode ser menor que o preço de custo."
          );
        }
      } else if (existingProduct) {
        // Verifica se o novo preço do produto atende aos requisitos
        if (newPrice > Number(existingProduct.costPrice)) {
          // Verifica se o novo preço está dentro da margem de 10%
          if (
            newPrice <= Number(existingProduct.salesPrice) * 1.1 &&
            newPrice >= Number(existingProduct.salesPrice) * 0.9
          ) {
            if (existingProductInPack) {
              // Verifica se o pacote do produto está no restante do arquivo
              if (
                await this.checkPackInFile(
                  Number(existingProductInPack.pack_id),
                  productsLine
                )
              ) {
                // Verifica se o novo preço do pacote condiz com a equação (preçoproduto * quantidade)
                // if (
                //   await this.checkPackPriceInFile(
                //     Number(pack?.code),
                //     productsLine
                //   )
                // ) {
                //   // Inserir no banco de dados e retornar a tabela de produtos
                // } else {
                //   throw new Error(
                //     "O novo preço do pacote do produto não condiz com o cálculo correto."
                //   );
                // }
              } else {
                throw new Error(
                  "Falta as informações referentes ao pacote do produto no arquivo CSV."
                );
              }
            } else {
              await client.products.update({
                where: { code: productCode },
                data: { salesPrice: newPrice },
              });
              return client.products;
            }
          } else {
            throw new Error(
              "A mudança no preço do produto não pode ser maior ou menor que 10% do preço atual."
            );
          }
        } else {
          throw new Error(
            "O Preço de venda do produto não pode ser menor que o preço de custo."
          );
        }
      } else {
        throw new Error("O código não existe!");
      }
    }
  }
  private async checkPackInFile(
    code: number,
    productsLine: readline.Interface
  ): Promise<boolean> {
    const packsRepo = client.packs;
    for await (let line of productsLine) {
      const split = line.split(",");
      const productCode = Number(split[0]);
      const existingPack = await packsRepo.findFirst({
        where: {
          pack_id: productCode,
        },
      });
      if (code == Number(existingPack?.pack_id)) {
        return true; // Pack encontrado
      }
    }
    return false; // Pack não encontrado
  }

  // //checa se o preço do pacote no arquivo confere com o preço de uma unidade do produto
  // private async checkPackPriceInFile(
  //   packCode: number,
  //   productsLine: readline.Interface
  // ): Promise<boolean> {
  //   const packsRepo = client.packs;
  //   const productsRepo = client.products;
  //   for await (let line of productsLine) {
  //     const split = line.split(",");
  //     const productCode = Number(split[0]);
  //     const newPrice = Number(split[1]);
  //     const packInPacks = await packsRepo.findFirst({
  //       where: {
  //         pack_id: productCode,
  //       },
  //     });
  //     const packInProducts = await productsRepo.findFirst({
  //       where: {
  //         code: packInPacks?.pack_id,
  //       },
  //     });
  //     if (code == Number(packInPacks?.pack_id)) {
  //       if (
  //         newPrice ==
  //         Number(packInProducts?.salesPrice) * Number(packInRepo?.qty)
  //       ) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false; // Pack não encontrado
  // }

  private async checkProductInFile(
    product_id: number,
    productsLine: readline.Interface
  ): Promise<boolean> {
    const productsRepo = client.products;
    for await (let line of productsLine) {
      const split = line.split(",");
      const productCode = Number(split[0]);
      const existingProduct = await productsRepo.findFirst({
        where: { code: productCode },
      });
      if (product_id == Number(existingProduct?.code)) {
        return true; // Product encontrado
      }
    }
    return false; // Product não encontrado
  }
  //   private async checkProductPriceInFile(
  //     code: number,
  //     productsLine: readline.Interface
  //   ): Promise<boolean> {
  //     const packsRepo = new PacksRepository();
  //     const productsRepo = new ProductsRepository();
  //     for await (let line of productsLine) {
  //       const split = line.split(",");
  //       const productCode = Number(split[0]);
  //       const newPrice = Number(split[1]);
  //       const packInRepo = await packsRepo.findPackbyCode(productCode);
  //       const pack = await productsRepo.findProductByCode(code);
  //       if (code == Number(packInRepo?.pack_id)) {
  //         if (newPrice == Number(pack?.salesPrice) / Number(packInRepo?.qty)) {
  //           return true;
  //         }
  //       }
  //     }
  //     return false; // Product não encontrado
  //   }
}
