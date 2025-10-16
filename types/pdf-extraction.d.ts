declare module "pdf-extraction" {
  function pdf(buffer: Buffer | Uint8Array): Promise<{ text: string }>;
  export default pdf;
}