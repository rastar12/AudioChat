import {StreamClient} from "@stream-io/node-sdk";

const apiKey="ep6kancczz9d";
const apiSecret="u5qdwyenkekvxvpthevaew6e5uw4tbtgauffyc7ad9c49bkgvdwmsb9m6mazpk4h";

export const client=new StreamClient(apiKey,apiSecret);