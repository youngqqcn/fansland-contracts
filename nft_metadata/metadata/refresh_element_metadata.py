#coding:utf8
import json
from time import sleep
import requests


def main():
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": ""
    }

    i = 53
    while i < 1000:
        try:

            # url = f"https://api.opensea.io/api/v2/chain/bsc/contract/0xbf36ab3aed81bf8553b52c61041904d98ee882c2/nfts/{i}/refresh"
            url = f"https://api.element.market/openapi/v1/asset/refreshMeta?chain=bsc&contract_address=0xbf36ab3aed81bf8553b52c61041904d98ee882c2&token_id={i}"

            # headers = {"accept": "application/json"}

            response = requests.get(url, headers=headers)
            print(response.text)
            i += 1
        except Exception as e:
            print(e)

    pass


if __name__ == '__main__':

    main()