import { Request, Response } from "express";
import { RefreshService } from "../services/RefreshService";

export class RefreshProductsController {
  async handle(req: Request, res: Response) {
    const { file } = req;
    const { buffer } = file!;

    const refreshService = new RefreshService();

    try {
      await refreshService.refresh(buffer);
      return res.status(200).end();
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  }
}
