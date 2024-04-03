#coding:utf8
import json
from time import sleep
import requests


def main():
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": "4ef00edc1db64d6fb2b1910cb9ec1003"
    }

    i = 0
    while i < 1000:
        try:
            url = f"https://api.opensea.io/api/v2/chain/bsc/contract/0xbf36ab3aed81bf8553b52c61041904d98ee882c2/nfts/{i}/refresh"
            response = requests.post(url, headers=headers)
            print(response.text)
            i += 1
        except Exception as e:
            print(e)

    pass


if __name__ == '__main__':

    main()