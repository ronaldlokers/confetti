export interface NavigationItem {
  label: string
  icon: string
  to?: string
  onClick?: () => void | Promise<void>
}

export interface NavigationTileItem extends NavigationItem {
  to: string
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
}
