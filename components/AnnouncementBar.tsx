type Props = {
  label: string
  url: string
}

export default function AnnouncementBar({ label, url }: Props) {
  return (
    <div
      className="text-center py-[15px] px-[10px]"
      style={{ backgroundImage: 'linear-gradient(88deg, var(--color-pink-from) 0%, var(--color-pink-to) 100%)' }}
    >
      <a href={url} className="text-sm font-medium text-white underline underline-offset-2">
        {label}
      </a>
    </div>
  )
}
