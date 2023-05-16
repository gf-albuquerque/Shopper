import { Request, Response } from "express";
import { GetProductsService } from "../services/GetProductsService";

export class GetProductsController {
  async handle(req: Request, res: Response) {
    const { code } = req.params;
    const service = new GetProductsService();

    try {
      const users = await service.getProducts();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  }
}
