type Props = {
  email: string
  address: string
  instagram: string
}

export default function Footer({ email, address, instagram }: Props) {
  return (
    <footer className="bg-[#10131c] border-t border-[#ffffff14] py-16 px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-bold text-white text-lg mb-4">VI Utrecht</h3>
          <p className="text-[#d5dbe6] text-sm whitespace-pre-line leading-relaxed">{address}</p>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg mb-4">Contact</h3>
          <a href={`mailto:${email}`} className="text-[#d5dbe6] text-sm hover:text-[#8c7df8] transition">
            {email}
          </a>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg mb-4">Volg ons</h3>
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-[#d5dbe6] text-sm hover:text-[#8c7df8] transition">
            Instagram
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#ffffff14] flex flex-col sm:flex-row justify-between text-[#d5dbe6]/50 text-xs gap-2">
        <span>© {new Date().getFullYear()} VI Utrecht</span>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-white transition">Privacybeleid</a>
          <a href="/voorwaarden" className="hover:text-white transition">Algemene voorwaarden</a>
        </div>
      </div>
    </footer>
  )
}
