import { C } from "../constants/brand";
import Calculator from "./Calculator";
import Checklist from "./Checklist";
import Worksheet from "./Worksheet";
import OnePager from "./OnePager";

export default function Block({ block }) {
  if (block.type === "p") return (
    <p className="text-[17px] leading-[1.85] text-gray-700 mb-5 font-serif">{block.text}</p>
  );

  if (block.type === "h2") return (
    <h2 className="text-[22px] font-bold text-tac-dark mb-3 mt-9 pb-2.5 border-b-2 border-tac-teal font-serif">{block.text}</h2>
  );

  if (block.type === "h3") return (
    <h3 className="text-[17px] font-bold text-tac-dark mb-2 mt-5">{block.text}</h3>
  );

  if (block.type === "pull") return (
    <div className="my-7 py-4 px-6 border-l-[5px] border-tac-teal bg-tac-teal/10 rounded-r-xl">
      <p className="text-xl italic text-tac-dark leading-relaxed m-0 font-serif">"{block.text}"</p>
    </div>
  );

  if (block.type === "nijma") return (
    <div className="my-7 border border-tac-teal border-l-[5px] rounded-r-xl overflow-hidden">
      <div className="bg-tac-teal/15 py-2 px-4 flex items-center gap-2">
        <span className="text-[15px]">{"\uD83D\uDCAC"}</span>
        <span className="text-[10px] font-bold text-tac-cyan tracking-widest">NIJMA'S VOICE — From practice</span>
      </div>
      <div className="py-4 px-5 bg-white">
        <p className="text-[15px] leading-[1.85] text-gray-600 italic m-0 font-serif">{block.text}</p>
      </div>
    </div>
  );

  if (block.type === "takeaway") return (
    <div className="my-8 bg-tac-dark rounded-xl p-5 border-l-[5px] border-tac-yellow">
      <div className="text-[10px] font-extrabold text-tac-yellow tracking-[.08em] mb-2">THE TAKEAWAY</div>
      <p className="text-base text-white leading-relaxed m-0 font-serif">{block.text}</p>
    </div>
  );

  if (block.type === "bullets") return (
    <div className="my-3 mb-6">
      {block.items.map((item, i) => (
        <div key={i} className="flex gap-3 mb-2.5">
          <div className="w-[7px] h-[7px] rounded-full bg-tac-cyan flex-shrink-0 mt-[9px]" />
          <p className="text-base leading-relaxed text-gray-700 flex-1 m-0 font-serif">
            {item.bold ? <><strong className="text-tac-dark">{item.bold}</strong>{item.rest}</> : item.text}
          </p>
        </div>
      ))}
    </div>
  );

  if (block.type === "table") return (
    <div className="overflow-x-auto my-5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {block.headers.map((h, i) => (
              <th key={i} className={`p-2.5 font-bold text-left text-[13px] ${
                i === 2 ? 'bg-tac-yellow text-tac-dark' : 'bg-tac-dark text-white'
              }`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={`p-2.5 border-b border-gray-100 text-gray-600 text-[13px] ${
                  i % 2 !== 0 ? 'bg-tac-blue85/25' : 'bg-white'
                }`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (block.type === "calculator") return <Calculator />;
  if (block.type === "checklist") return <Checklist />;
  if (block.type === "worksheet") return <Worksheet />;
  if (block.type === "onepager") return <OnePager />;

  if (block.type === "asset" || block.type === "assetcard") return (
    <div className="flex gap-3.5 p-3.5 border border-gray-200 border-l-4 border-l-tac-cyan rounded-lg bg-[#fafcfd] mb-2.5 items-start">
      <div className="text-2xl flex-shrink-0 mt-0.5">{block.icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tac-teal/20 text-tac-blue17 tracking-wide">{block.assetType}</span>
          <span className="text-sm font-bold text-tac-dark">{block.title}</span>
        </div>
        <p className="text-[13px] text-gray-500 leading-snug m-0">{block.desc}</p>
      </div>
      <div className="flex-shrink-0 px-3 py-1 rounded-md border border-tac-dark text-tac-dark text-xs font-semibold cursor-pointer hover:bg-tac-dark hover:text-white transition-colors">
        Download
      </div>
    </div>
  );

  if (block.type === "assets") return (
    <div className="mt-5">
      {block.items.map((a, i) => <Block key={i} block={{ ...a, type: "assetcard" }} />)}
    </div>
  );

  return null;
}
