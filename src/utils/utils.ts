import { QARecord, PieData } from "./Types";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

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