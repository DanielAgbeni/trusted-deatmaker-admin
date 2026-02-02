// components/ui/sidebar-right-provider.tsx
"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const SIDEBAR_RIGHT_COOKIE_NAME = "sidebar_right_state"
const SIDEBAR_RIGHT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_RIGHT_WIDTH = "18rem"
const SIDEBAR_RIGHT_WIDTH_MOBILE = "20rem"
const SIDEBAR_RIGHT_WIDTH_ICON = "3rem"
const SIDEBAR_RIGHT_KEYBOARD_SHORTCUT = "j"

type SidebarRightContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarRightContext = React.createContext<SidebarRightContextProps | null>(null)

export function useSidebarRight() {
  const context = React.useContext(SidebarRightContext)
  if (!context) {
    throw new Error("useSidebarRight must be used within a SidebarRightProvider.")
  }

  return context
}

export function SidebarRightProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_RIGHT_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_RIGHT_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_RIGHT_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarRightContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarRightContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-right-wrapper"
        style={
          {
            "--sidebar-right-width": SIDEBAR_RIGHT_WIDTH,
            "--sidebar-right-width-icon": SIDEBAR_RIGHT_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-right-wrapper flex min-h-svh w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarRightContext.Provider>
  )
}