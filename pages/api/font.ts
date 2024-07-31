import type { NextApiRequest, NextApiResponse } from 'next'
import jsonFont from "../../src/classes/ParticleText/assets/font.json"

type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json(jsonFont);
}