import { QARecord, PieData } from "./Types"
import { Clipboard } from "@capacitor/clipboard"
import { Browser } from "@capacitor/browser"

// sleep function
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// server address
export const server = import.meta.env.VITE_APP_SERVER

// copy to device native clipboard
export const copy = async (txt: string) => {
  await Clipboard.write({
    string: txt
  })
}

export const openInBrowser = async (link: string) => {
  await Browser.open({
    url: link
  })
}

// sealed = primary
// new = success
// used like new = secondary
// used = dark
// damaged = danger
// missing parts = warning
export const getVariant = (condition: string) => {
  switch (condition) {
    case 'Sealed':
      return 'primary'
    case 'New':
      return 'success'
    case 'Used Like New':
      return 'secondary'
    case 'Used':
      return 'secondary'
    case 'Damaged':
      return 'danger'
    case 'As Is':
      return 'warning'
    default:
      'secondary'
  }
}

export const getChartData = (inventoryArr: QARecord[]) => {
  const _new = {
    name: 'New',
    amount: 0
  }
  const _used = {
    name: 'Used',
    amount: 0
  }
  const _usedLikeNew = {
    name: 'Used Like New',
    amount: 0
  }
  const _sealed = {
    name: 'Sealed',
    amount: 0
  }
  const _damaged = {
    name: 'Damaged',
    amount: 0
  }
  const _asIs = {
    name: 'As Is',
    amount: 0
  }
  inventoryArr.forEach(item => {
    switch (item.itemCondition) {
      case 'New':
        _new.amount++
        break;
      case 'Used':
        _used.amount++
        break;
      case 'Used Like New':
        _usedLikeNew.amount++
        break;
      case 'Sealed':
        _sealed.amount++
        break;
      case 'Damaged':
        _damaged.amount++
        break;
      case 'As Is':
        _asIs.amount++
        break;
      default:
        break;
    }
  })
  const data: PieData[] = [
    _new,
    _used,
    _usedLikeNew,
    _sealed,
    _damaged,
    _asIs
  ]
  return data
}

// object type from server
export type InvInfo = {
  "Used": number,
  "As Is": number,
  "New": number,
  "Used Like New": number,
  "Sealed": number
}

// tremor chart data
export type ChartData = {
  name: string,
  amount: number
}

// converts server responsed data to chart data
export const convertChartData = (info: InvInfo) => {
  return [
    {
      name: 'New',
      amount: info['New']
    },
    {
      name: 'Used',
      amount: info['Used']
    },
    {
      name: 'As Is',
      amount: info['As Is']
    },
    {
      name: 'Used Like New',
      amount: info['Used Like New']
    },
    {
      name: 'Sealed',
      amount: info['Sealed']
    },
  ]
}