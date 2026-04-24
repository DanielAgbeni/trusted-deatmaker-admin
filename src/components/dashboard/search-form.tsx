"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, User, FileText, AlertCircle, X } from "lucide-react"

import { useGetAuditLogsQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

interface AuditLog {
  id: string
  action: string
  module: string
  userId: string
  // ... other fields as needed
  description: string
  timestamp: string
}

interface SearchResponse {
  success: boolean
  data: {
    content: AuditLog[]
  }
}

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<AuditLog[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(searchQuery, 300)

  const { data, isLoading, isFetching } = useGetAuditLogsQuery(
    {
      userSearch: debouncedQuery,
      page: 0,
      size: 5,
    },
    {
      skip: !debouncedQuery,
    }
  )

  useEffect(() => {
    if (debouncedQuery && data?.data?.content) {
      setResults(data.data.content as unknown as AuditLog[]);
      setOpen(true);
    } else if (!debouncedQuery) {
      setResults([]);
    }
  }, [data, debouncedQuery]);

  const loadingState = isLoading || isFetching;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (item: AuditLog) => {
    setOpen(false)
    setSearchQuery("")
    if (item.userId) {
      router.push(`/dashboard/ad/users/${item.userId}`)
    } else {
      // Fallback or specific handling for non-user logs
      console.log("Selected item:", item)
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-100 font-medium text-foreground">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    )
  }

  return (
    <form {...props} className="relative w-full max-w-[80px] sm:max-w-[200px] md:max-w-[240px]" onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative" ref={containerRef}>
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <SidebarInput
              id="search"
              placeholder="Search users, actions..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value) setOpen(true)
              }}
              onFocus={() => {
                if (searchQuery) setOpen(true)
              }}
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            {loadingState && (
              <Loader2 className="absolute right-2 top-1/2 size-4 -translate-y-1/2 animate-spin opacity-50" />
            )}
            {!loadingState && searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 opacity-50 hover:bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setResults([])
                  setOpen(false)
                }}
              >
                <X className="size-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {open && (searchQuery || results.length > 0) && (
            <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
              <div className="max-h-[300px] overflow-y-auto p-1">
                {results.length === 0 && !loadingState ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {results.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left"
                      >
                        <div className="flex items-start gap-2 w-full">
                          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted">
                            {item.module === "USER" ? (
                              <User className="size-4" />
                            ) : item.module === "AUDIT" ? (
                              <AlertCircle className="size-4" />
                            ) : (
                              <FileText className="size-4" />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate font-medium">
                              {highlightMatch(item.action, searchQuery)}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {item.description}
                            </span>
                            <span className="truncate text-[10px] text-muted-foreground/70 mt-0.5">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
