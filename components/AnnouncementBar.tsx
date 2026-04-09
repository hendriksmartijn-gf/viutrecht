type Props = {
  label: string
  url: string
}

export default function AnnouncementBar({ label, url }: Props) {
  return (
    <div className="bg-[#8c7df8] text-[#10131c] text-sm font-semibold text-center py-2.5 px-4">
      <a href={url} className="hover:underline">
        {label}
      </a>
    </div>
  )
}
