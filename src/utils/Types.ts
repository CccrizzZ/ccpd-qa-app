export type Condition = 'New' | 'Sealed' | 'Used' | 'Used Like New' | 'Damaged' | 'As Is'
export type Platform = 'Amazon' | 'eBay' | 'Official Website' | 'Other'

export interface QARecord {
    sku: number,
    itemCondition: Condition,
    comment: string,
    link: string,
    platform: Platform,
    shelfLocation: string,
    amount: number,
    owner?: string
    images?: string[]
}