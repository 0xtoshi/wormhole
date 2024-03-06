import axios from "axios";

export default async function handler(req, res) {
  const address = req.query.address;
  if (validateInputAddresses(address) == true) {
    try {
      let data = await axios.get(
        `https://prod-flat-files-min.wormhole.com/${address.toLowerCase()}_2.json`
      );
      res.status(200).json({ status: 200, data: await data.data });
    } catch (err) {
      res.status(200).json({ status: 400, message: "Address Not Eligible" });
    }
  } else {
    res.status(200).json({ status: 400, message: "Invalid Address" });
    //throw { status: "error", message: "Invalid Ip Address" };
  }
}

function validateInputAddresses(address) {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
}

function validateInputAddressesStarknet(address) {
  return /^(0x){1}[0-9a-fA-F]{64}$/i.test(address);
}
