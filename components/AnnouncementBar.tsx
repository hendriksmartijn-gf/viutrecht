type Props = {
  label: string
  url: string
}

export default function AnnouncementBar({ label, url }: Props) {
  return (
    <div className="bg-black text-white text-sm text-center py-2 px-4">
      <a href={url} className="hover:underline">
        {label}
      </a>
    </div>
  )
}
