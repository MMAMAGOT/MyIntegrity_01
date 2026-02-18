import { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

const VALUES_DATA = [
  { category: "行動・姿勢", icon: "⚡", values: [
    { id: "sincerity", label: "誠実", desc: "嘘をつかない、表裏がない" },
    { id: "courage", label: "勇気", desc: "恐れずに立ち向かう、信念を貫く" },
    { id: "responsibility", label: "責任", desc: "自分の言動に最後まで責任を持つ" },
    { id: "discipline", label: "規律", desc: "自分を律する、習慣を重んじる" },
    { id: "humility", label: "謙虚", desc: "慢心せず、常に学ぶ姿勢を持つ" },
    { id: "challenge", label: "挑戦", desc: "新しいこと、困難なことに挑む" },
    { id: "patience", label: "忍耐", desc: "苦境でも諦めずに耐え抜く" },
    { id: "passion", label: "情熱", desc: "熱意を持って物事に取り組む" },
    { id: "thoroughness", label: "徹底", desc: "細部まで妥協せずやり遂げる" },
    { id: "speed", label: "スピード", desc: "素早く決断し、行動する" },
  ]},
  { category: "知性・創造", icon: "💡", values: [
    { id: "wisdom", label: "知恵", desc: "知識を活かし、本質を見抜く" },
    { id: "logic", label: "論理", desc: "筋道を立てて客観的に考える" },
    { id: "intuition", label: "直感", desc: "自分の感覚やひらめきを信じる" },
    { id: "creation", label: "創造", desc: "新しい価値や仕組みを生み出す" },
    { id: "inquiry", label: "探求", desc: "真理や知識を深く追い求める" },
    { id: "curiosity", label: "好奇心", desc: "未知のものに興味を持つ" },
    { id: "refinement", label: "洗練", desc: "磨き上げられた美しさや質を追う" },
    { id: "originality", label: "独創", desc: "他人とは違う独自の道を行く" },
    { id: "efficiency", label: "効率", desc: "無駄を省き、最適化する" },
    { id: "learning", label: "学習", desc: "生涯、学び続け成長する" },
  ]},
  { category: "人間関係・社会", icon: "🤝", values: [
    { id: "contribution", label: "貢献", desc: "他者や社会の役に立つ" },
    { id: "trust", label: "信頼", desc: "互いに信じ合える関係を築く" },
    { id: "empathy", label: "共感", desc: "相手の気持ちに寄り添う" },
    { id: "harmony", label: "調和", desc: "周囲とのバランスを大切にする" },
    { id: "tolerance", label: "寛容", desc: "違いを認め、許容する" },
    { id: "fairness", label: "公正", desc: "公平に、偏りなく接する" },
    { id: "courtesy", label: "礼節", desc: "礼儀と節度をわきまえる" },
    { id: "love", label: "愛", desc: "慈しみ、大切に想う" },
    { id: "gratitude", label: "感謝", desc: "ありがたみを感じ、伝える" },
    { id: "influence", label: "影響", desc: "他者にポジティブな変化を与える" },
  ]},
  { category: "自己・内面", icon: "🪷", values: [
    { id: "freedom", label: "自由", desc: "何にも縛られず、自律的に生きる" },
    { id: "independence", label: "自立", desc: "自分の力で立ち、依存しない" },
    { id: "peace", label: "平安", desc: "心の穏やかさと静けさを保つ" },
    { id: "honesty", label: "正直", desc: "自分自身の心に素直でいる" },
    { id: "happiness", label: "幸福", desc: "自分なりの幸せを追求する" },
    { id: "health", label: "健康", desc: "心身の健やかさを維持する" },
    { id: "composure", label: "余裕", desc: "心や時間にゆとりを持つ" },
    { id: "simplicity", label: "シンプル", desc: "複雑さを避け、本質的に生きる" },
    { id: "adventure", label: "冒険", desc: "リスクを取って未知の世界へ出る" },
    { id: "consistency", label: "一貫性", desc: "言動が常に一致している" },
  ]},
  { category: "環境・成果", icon: "🏔", values: [
    { id: "stability", label: "安定", desc: "揺らぎのない基盤を維持する" },
    { id: "change", label: "変化", desc: "常に新しく変わり続ける" },
    { id: "tradition", label: "伝統", desc: "歴史や受け継がれたものを守る" },
    { id: "diversity", label: "多様性", desc: "多種多様な存在を尊重する" },
    { id: "excellence", label: "卓越", desc: "最高水準の成果を追求する" },
    { id: "victory", label: "勝利", desc: "競争に勝ち、目標を達成する" },
    { id: "wealth", label: "富", desc: "経済的な豊かさを手に入れる" },
    { id: "honor", label: "名誉", desc: "誇り高くあり、尊敬される" },
    { id: "sustainability", label: "持続可能性", desc: "長く続く仕組みを大切にする" },
    { id: "playfulness", label: "遊び心", desc: "楽しさやユーモアを忘れない" },
  ]},
];

const ALL_VALUES = VALUES_DATA.flatMap(c => c.values);

const STEPS = [
  { num: 0, label: "はじめに" },
  { num: 1, label: "価値観を選ぶ" },
  { num: 2, label: "エピソード分析" },
  { num: 3, label: "トーナメント" },
  { num: 4, label: "あなたの核" },
];

/* ─── Shared Components ─── */

function FadeIn({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)`,
    }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, style: s = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#bbb" : "linear-gradient(135deg, #4a2f14 0%, #6b4423 100%)",
      color: disabled ? "#ddd" : "#e8d5b7",
      border: "none", borderRadius: "60px",
      padding: "15px 44px",
      fontSize: "14px", fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "0.08em",
      boxShadow: disabled ? "none" : "0 6px 28px rgba(74,47,20,0.35)",
      transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      ...s,
    }}
    onMouseOver={e => { if(!disabled){ e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(74,47,20,0.45)"; }}}
    onMouseOut={e => { if(!disabled){ e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 28px rgba(74,47,20,0.35)"; }}}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, style: s = {} }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", color: "#999",
      border: "1.5px solid #d5d0c8", borderRadius: "60px",
      padding: "11px 28px", fontSize: "13px",
      cursor: "pointer", transition: "all 0.2s",
      ...s,
    }}
    onMouseOver={e => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.color = "#555"; }}
    onMouseOut={e => { e.currentTarget.style.borderColor = "#d5d0c8"; e.currentTarget.style.color = "#999"; }}
    >{children}</button>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <div style={{
      display: "flex", gap: "2px", justifyContent: "center",
      padding: "18px 0 14px", flexWrap: "wrap",
    }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < currentStep ? "13px" : "11px", fontWeight: 600,
            background: i < currentStep ? "#4a2f14" : i === currentStep ? "linear-gradient(135deg, #4a2f14, #6b4423)" : "transparent",
            color: i <= currentStep ? "#e8d5b7" : "#aaa",
            border: i <= currentStep ? "none" : "1.5px solid #ccc",
            transition: "all 0.5s ease",
            boxShadow: i === currentStep ? "0 0 0 3px rgba(30,27,75,0.15)" : "none",
          }}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: 18, height: "2px",
              background: i < currentStep ? "#4a2f14" : "#ddd",
              borderRadius: 1,
              transition: "background 0.5s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Particles Background ─── */
function FloatingParticles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 4 + Math.random() * 6,
          height: 4 + Math.random() * 6,
          borderRadius: "50%",
          background: `rgba(${180 + Math.random()*40}, ${160 + Math.random()*40}, ${120 + Math.random()*40}, ${0.12 + Math.random()*0.12})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `floatParticle ${8 + Math.random() * 12}s ease-in-out infinite`,
          animationDelay: `${-Math.random() * 10}s`,
        }} />
      ))}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          25% { transform: translate(${20}px, -${30}px) scale(1.3); opacity: 0.25; }
          50% { transform: translate(-${15}px, ${20}px) scale(0.8); opacity: 0.1; }
          75% { transform: translate(${25}px, ${10}px) scale(1.1); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

/* ─── Step 0: Intro ─── */
function IntroScreen({ onStart }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 16px 20px", position: "relative", overflow: "hidden" }}>
      <FadeIn delay={100}>
        <img
          src="data:image/jpeg;base64,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"
          alt="My Integrity"
          style={{
            width: 88, height: 88, margin: "0 auto 22px",
            borderRadius: "22px",
            boxShadow: "0 10px 36px rgba(92,61,30,0.3)",
            display: "block",
            objectFit: "cover",
          }}
        />
      </FadeIn>

      <FadeIn delay={300}>
        <h1 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "clamp(24px, 5.5vw, 44px)",
          fontWeight: 700,
          color: "#4a2f14",
          marginBottom: "4px",
          letterSpacing: "0.05em",
          padding: "0 16px",
        }}>マイインテグリティ</h1>
        <p style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "14px", fontWeight: 400,
          color: "#8a6840", letterSpacing: "0.2em",
          marginBottom: "4px",
        }}>My Integrity</p>
      </FadeIn>

      <FadeIn delay={500}>
        <p style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "12px", color: "#a89070", letterSpacing: "0.2em",
          marginBottom: "36px",
        }}>— 人間のインテグリティを探る —</p>
      </FadeIn>

      <FadeIn delay={700}>
        <div style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "28px 20px",
          maxWidth: "460px", margin: "0 auto 32px",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          boxSizing: "border-box",
          width: "100%",
        }}>
          <p style={{
            fontSize: "clamp(13px, 3.2vw, 15px)", lineHeight: 2.1,
            color: "#3a3a3a", textAlign: "left", margin: 0,
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}>
            インテグリティとは、
            <strong style={{ color: "#4a2f14" }}>自分の価値観に対する一貫性・真摯さ</strong>のこと。
            <br /><br />
            このワークでは、3つのステップを通じて、あなたの「<strong style={{ color: "#4a2f14" }}>譲れない核となる価値観</strong>」を見つけ出します。
          </p>
        </div>
      </FadeIn>

      <div style={{
        display: "flex", flexDirection: "column", gap: "10px",
        maxWidth: "400px", margin: "0 auto 40px",
      }}>
        {[
          { step: "Step 1", text: "50の価値観から直感で選ぶ", icon: "🔍", color: "#d4a853" },
          { step: "Step 2", text: "人生のエピソードで深掘りする", icon: "📖", color: "#8b6f47" },
          { step: "Step 3", text: "トーナメントで3つに絞る", icon: "🏆", color: "#6b5b3e" },
        ].map((item, i) => (
          <FadeIn key={i} delay={900 + i * 180}>
            <div style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(8px)",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.5)",
              textAlign: "left",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: "12px",
                background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: item.color, letterSpacing: "0.12em" }}>{item.step}</div>
                <div style={{ fontSize: "14px", color: "#2a2a2a", fontWeight: 500 }}>{item.text}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={1500}>
        <PrimaryBtn onClick={onStart}>ワークを始める</PrimaryBtn>
        <p style={{ fontSize: "11px", color: "#bbb", marginTop: "14px" }}>所要時間：約5〜10分</p>
      </FadeIn>
    </div>
  );
}

/* ─── Step 1: Value Selection ─── */
function ValueSelection({ selected, setSelected, onNext }) {
  const count = selected.length;
  const canProceed = count >= 8 && count <= 15;

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : prev.length < 15 ? [...prev, id] : prev
    );
  };

  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "22px", fontWeight: 700, color: "#4a2f14",
          marginBottom: "6px",
        }}>Step 1：価値観を選ぶ</h2>
        <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8 }}>
          「こうあるべき」ではなく、<strong style={{ color: "#555" }}>つい選んでしまう</strong>ものを直感で。
        </p>
      </div>

      {/* Sticky counter */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(244,236,224,0.92)",
        backdropFilter: "blur(12px)",
        padding: "12px 16px",
        borderRadius: "0 0 16px 16px",
        marginBottom: "16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div>
          <span style={{
            fontSize: "22px", fontWeight: 700,
            color: canProceed ? "#2d6a4f" : count > 15 ? "#c1292e" : "#4a2f14",
            fontFamily: "'Noto Serif JP', serif",
          }}>{count}</span>
          <span style={{ fontSize: "12px", color: "#999", marginLeft: "4px" }}>/15</span>
        </div>
        <div style={{
          width: 120, height: 6, background: "#e8e2d8",
          borderRadius: 3, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 3,
            width: `${Math.min(count / 8, 1) * 100}%`,
            background: canProceed
              ? "linear-gradient(90deg, #2d6a4f, #52b788)"
              : "linear-gradient(90deg, #4a2f14, #8a6840)",
            transition: "all 0.4s ease",
          }} />
        </div>
        <span style={{
          fontSize: "11px", fontWeight: 600,
          color: canProceed ? "#2d6a4f" : "#aaa",
        }}>
          {count < 8 ? `あと${8 - count}個` : "OK ✓"}
        </span>
      </div>

      {VALUES_DATA.map((cat, ci) => (
        <FadeIn key={ci} delay={ci * 80}>
          <div style={{ marginBottom: "22px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "10px", padding: "0 2px",
            }}>
              <span style={{ fontSize: "16px" }}>{cat.icon}</span>
              <span style={{
                fontSize: "11px", fontWeight: 700,
                color: "#8a7e72", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>{cat.category}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {cat.values.map(v => {
                const isSelected = selected.includes(v.id);
                return (
                  <button key={v.id} onClick={() => toggle(v.id)} title={v.desc}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "40px",
                      border: isSelected ? "2px solid transparent" : "1.5px solid #d5d0c8",
                      background: isSelected
                        ? "linear-gradient(135deg, #4a2f14, #6b4423)"
                        : "rgba(255,255,255,0.7)",
                      color: isSelected ? "#e8d5b7" : "#4a4a4a",
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                      boxShadow: isSelected
                        ? "0 4px 16px rgba(74,47,20,0.25)"
                        : "0 1px 4px rgba(0,0,0,0.03)",
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={e => { if(!isSelected) { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.transform = "scale(1.04)"; }}}
                    onMouseOut={e => { if(!isSelected) { e.currentTarget.style.borderColor = "#d5d0c8"; e.currentTarget.style.transform = "scale(1)"; }}}
                  >
                    {isSelected && <span style={{ marginRight: "4px", fontSize: "11px" }}>✦</span>}
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>
      ))}

      <div style={{ textAlign: "center", padding: "16px 0 10px" }}>
        <PrimaryBtn onClick={onNext} disabled={!canProceed}>
          次へ：エピソード分析 →
        </PrimaryBtn>
      </div>
    </FadeIn>
  );
}

/* ─── Step 2: Episode Analysis ─── */
function EpisodeAnalysis({ selected, episodes, setEpisodes, onNext, onBack }) {
  const selectedLabels = selected.map(id => ALL_VALUES.find(v => v.id === id)?.label).filter(Boolean);

  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "22px", fontWeight: 700, color: "#4a2f14",
          marginBottom: "6px",
        }}>Step 2：エピソード分析</h2>
        <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8 }}>
          価値観が人生のどの場面で現れたかを振り返ります。
        </p>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: "5px",
        justifyContent: "center", marginBottom: "24px",
      }}>
        {selectedLabels.map((label, i) => (
          <span key={i} style={{
            padding: "3px 10px", borderRadius: "20px",
            background: "rgba(74,47,20,0.06)",
            fontSize: "11px", color: "#4a2f14", fontWeight: 500,
          }}>{label}</span>
        ))}
      </div>

      {/* Best Moment */}
      <FadeIn delay={150}>
        <div style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "16px",
          border: "1px solid rgba(255,255,255,0.5)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: 4, height: "100%",
            background: "linear-gradient(180deg, #d4a853, #c49b3d)",
            borderRadius: "4px 0 0 4px",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "26px" }}>✨</span>
            <h3 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "16px", fontWeight: 700, color: "#4a2f14", margin: 0,
            }}>最高の瞬間</h3>
          </div>
          <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.8, marginBottom: "14px" }}>
            最高に充実していた、あるいは誇らしかった瞬間は？<br />
            その時、どの価値観が満たされていましたか？
          </p>
          <textarea value={episodes.best}
            onChange={e => setEpisodes({ ...episodes, best: e.target.value })}
            placeholder="例：チームでプロジェクトを成功させた時。全員が信頼し合い、挑戦を恐れなかった..."
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px",
              border: "1.5px solid #e8e2d8", borderRadius: "12px",
              fontSize: "14px", lineHeight: 1.9, resize: "vertical",
              fontFamily: "inherit", color: "#333",
              background: "rgba(255,255,255,0.5)", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#d4a853"}
            onBlur={e => e.target.style.borderColor = "#e8e2d8"}
          />
        </div>
      </FadeIn>

      {/* Anger Moment */}
      <FadeIn delay={300}>
        <div style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "16px",
          border: "1px solid rgba(255,255,255,0.5)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: 4, height: "100%",
            background: "linear-gradient(180deg, #8b3a3a, #6b2a2a)",
            borderRadius: "4px 0 0 4px",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "26px" }}>🔥</span>
            <h3 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "16px", fontWeight: 700, color: "#4a2f14", margin: 0,
            }}>最高の怒り</h3>
          </div>
          <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.8, marginBottom: "14px" }}>
            猛烈に腹が立ったことは何ですか？<br />
            <em style={{ color: "#8b3a3a" }}>ヒント：強い怒りは「譲れない価値観」が侵害された時に起こります。</em>
          </p>
          <textarea value={episodes.anger}
            onChange={e => setEpisodes({ ...episodes, anger: e.target.value })}
            placeholder="例：不正が見て見ぬふりされた時。公正さが踏みにじられた感覚が許せなかった..."
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px",
              border: "1.5px solid #e8e2d8", borderRadius: "12px",
              fontSize: "14px", lineHeight: 1.9, resize: "vertical",
              fontFamily: "inherit", color: "#333",
              background: "rgba(255,255,255,0.5)", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#8b3a3a"}
            onBlur={e => e.target.style.borderColor = "#e8e2d8"}
          />
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <div style={{
          background: "rgba(74,47,20,0.03)", borderRadius: "14px",
          padding: "14px 18px", marginBottom: "24px",
        }}>
          <p style={{ fontSize: "12px", color: "#777", lineHeight: 1.9, margin: 0 }}>
            💡 エピソードは空欄でも次へ進めます。後から振り返るのもOKです。
          </p>
        </div>
      </FadeIn>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", padding: "6px 0" }}>
        <GhostBtn onClick={onBack}>← 戻る</GhostBtn>
        <PrimaryBtn onClick={onNext}>次へ：トーナメント →</PrimaryBtn>
      </div>
    </FadeIn>
  );
}

/* ─── Step 3: Tournament ─── */
function Tournament({ selected, onComplete, onBack }) {
  const [pool, setPool] = useState(() => [...selected].sort(() => Math.random() - 0.5));
  const [matchIndex, setMatchIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [winners, setWinners] = useState([]);
  const [choosing, setChoosing] = useState(false);
  const [done, setDone] = useState(false);
  const [finalThree, setFinalThree] = useState([]);
  const [chosenInMatch, setChosenInMatch] = useState(null);
  const [matchCount, setMatchCount] = useState(0);

  const totalMatches = useRef(0);
  useEffect(() => {
    let count = 0;
    let p = selected.length;
    while (p > 3) { count += Math.floor(p / 2); p = Math.ceil(p / 2); }
    totalMatches.current = count;
  }, [selected.length]);

  const a = pool[matchIndex * 2];
  const b = pool[matchIndex * 2 + 1];
  const valA = ALL_VALUES.find(v => v.id === a);
  const valB = ALL_VALUES.find(v => v.id === b);
  const isBye = !b;

  useEffect(() => {
    if (isBye && a && !done) {
      const newWinners = [...winners, a];
      if ((matchIndex + 1) * 2 >= pool.length) {
        if (newWinners.length <= 3) {
          setFinalThree(newWinners); setDone(true);
        } else {
          setPool(newWinners.sort(() => Math.random() - 0.5));
          setWinners([]); setMatchIndex(0); setRound(r => r + 1);
        }
      } else {
        setWinners(newWinners); setMatchIndex(i => i + 1);
      }
    }
  }, [matchIndex, pool, isBye]);

  const choose = (winnerId) => {
    if (choosing) return;
    setChosenInMatch(winnerId);
    setChoosing(true);
    setMatchCount(c => c + 1);
    setTimeout(() => {
      const newWinners = [...winners, winnerId];
      if ((matchIndex + 1) * 2 >= pool.length) {
        if (newWinners.length <= 3) {
          setFinalThree(newWinners); setDone(true);
        } else {
          setPool(newWinners.sort(() => Math.random() - 0.5));
          setWinners([]); setMatchIndex(0); setRound(r => r + 1);
        }
      } else {
        setWinners(newWinners); setMatchIndex(i => i + 1);
      }
      setChoosing(false); setChosenInMatch(null);
    }, 600);
  };

  if (done) {
    return (
      <FadeIn>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            fontSize: "56px", marginBottom: "16px",
            animation: "popIn 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}>🏆</div>
          <style>{`@keyframes popIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }`}</style>
          <h2 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "22px", fontWeight: 700, color: "#4a2f14", marginBottom: "6px",
          }}>トーナメント完了！</h2>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "28px" }}>
            あなたの核となる価値観が見つかりました
          </p>
          <div style={{
            display: "flex", gap: "10px", justifyContent: "center",
            flexWrap: "wrap", marginBottom: "32px",
          }}>
            {finalThree.map((id, i) => {
              const v = ALL_VALUES.find(val => val.id === id);
              return (
                <FadeIn key={id} delay={400 + i * 300}>
                  <div style={{
                    background: "linear-gradient(135deg, #4a2f14, #6b4423)",
                    color: "#e8d5b7",
                    padding: "22px 26px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 32px rgba(74,47,20,0.3)",
                    minWidth: "100px",
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Noto Serif JP', serif" }}>
                      {v?.label}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>{v?.desc}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <PrimaryBtn onClick={() => onComplete(finalThree)}>結果を確認する →</PrimaryBtn>
        </div>
      </FadeIn>
    );
  }

  if (!valA || isBye) return null;

  const overallProgress = totalMatches.current > 0 ? matchCount / totalMatches.current : 0;

  return (
    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: "22px", fontWeight: 700, color: "#4a2f14", marginBottom: "6px",
        }}>Step 3：トーナメント</h2>
        <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8, marginBottom: "16px" }}>
          どちらかしか選べないなら、<strong style={{ color: "#555" }}>どちらが捨てがたい？</strong>
        </p>

        <div style={{
          display: "inline-flex", gap: "12px", alignItems: "center",
          background: "rgba(255,255,255,0.5)", borderRadius: "30px",
          padding: "6px 18px", fontSize: "11px", color: "#999",
          backdropFilter: "blur(6px)",
        }}>
          <span>ラウンド {round}</span>
          <span style={{ color: "#ddd" }}>|</span>
          <span>残り {pool.length}個 → {Math.ceil(pool.length / 2)}個</span>
        </div>

        <div style={{
          width: "100%", maxWidth: 280, height: 4,
          background: "#e8e2d8", borderRadius: 2,
          margin: "14px auto 4px", overflow: "hidden",
        }}>
          <div style={{
            width: `${overallProgress * 100}%`, height: "100%",
            background: "linear-gradient(90deg, #4a2f14, #d4a853)",
            borderRadius: 2, transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ fontSize: "10px", color: "#bbb" }}>
          全体進捗 {Math.round(overallProgress * 100)}%
        </div>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "14px", padding: "16px 10px",
      }}>
        {[{ val: valA, id: a }, { val: valB, id: b }].map(({ val, id }, i) => {
          if (!val) return null;
          const isChosen = chosenInMatch === id;
          const isRejected = chosenInMatch && chosenInMatch !== id;
          return (
            <button key={id} onClick={() => choose(id)}
              style={{
                width: "100%", maxWidth: 320,
                padding: "28px 24px",
                borderRadius: "20px",
                border: "2px solid",
                borderColor: isChosen ? "#d4a853" : isRejected ? "#e8e2d8" : "rgba(255,255,255,0.6)",
                background: isChosen
                  ? "linear-gradient(135deg, #4a2f14, #6b4423)"
                  : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                color: isChosen ? "#e8d5b7" : isRejected ? "#ccc" : "#4a2f14",
                cursor: choosing ? "default" : "pointer",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "6px",
                boxShadow: isChosen
                  ? "0 10px 40px rgba(74,47,20,0.35)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
                transform: isChosen ? "scale(1.04)" : isRejected ? "scale(0.96)" : "scale(1)",
                opacity: isRejected ? 0.4 : 1,
              }}
              onMouseOver={e => { if(!choosing){ e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"; }}}
              onMouseOut={e => { if(!choosing && !isChosen){ e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}}
            >
              <span style={{
                fontSize: "30px", fontFamily: "'Noto Serif JP', serif", fontWeight: 700,
                letterSpacing: "0.08em",
              }}>{val.label}</span>
              <span style={{ fontSize: "12px", opacity: 0.6, lineHeight: 1.5 }}>{val.desc}</span>
            </button>
          );
        })}
      </div>

      <div style={{
        textAlign: "center", margin: "8px 0 0",
        fontSize: "22px", color: "#d0cbc3",
        fontFamily: "'Noto Serif JP', serif",
        fontWeight: 300,
      }}>VS</div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <GhostBtn onClick={onBack} style={{ fontSize: "11px", padding: "8px 20px" }}>最初からやり直す</GhostBtn>
      </div>
    </FadeIn>
  );
}

/* ─── Step 4: Results with Share Card ─── */
function Results({ finalThree, episodes, onRestart }) {
  const [definitions, setDefinitions] = useState({});
  const [showShareTip, setShowShareTip] = useState(false);
  const shareCardRef = useRef(null);

  const threeLabels = finalThree.map(id => ALL_VALUES.find(v => v.id === id)?.label).join("・");

  const [showSnsMenu, setShowSnsMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const shareText = `🔸 マイインテグリティ診断結果\n\n私の核となる3つの価値観：\n${finalThree.map((id, i) => {
    const v = ALL_VALUES.find(val => val.id === id);
    const medals = ["🥇", "🥈", "🥉"];
    return `${medals[i]} ${v?.label}（${v?.desc}）`;
  }).join("\n")}\n\n#マイインテグリティ #価値観 #自己理解`;

  const shareUrl = "https://mmamagot.github.io/MyIntegrity_01/";

  const generateImage = async () => {
    if (!shareCardRef.current) return null;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      setIsGenerating(false);
      return { canvas, blob };
    } catch (e) {
      setIsGenerating(false);
      return null;
    }
  };

  const handleSaveImage = async () => {
    const result = await generateImage();
    if (!result) return;
    const link = document.createElement("a");
    link.download = "my-integrity-result.png";
    link.href = result.canvas.toDataURL("image/png");
    link.click();
  };

  const handleShareWithImage = async (sns) => {
    const result = await generateImage();

    // Try Web Share API with image (mobile)
    if (result?.blob && navigator.canShare) {
      const file = new File([result.blob], "my-integrity-result.png", { type: "image/png" });
      const shareData = {
        text: shareText + "\n" + shareUrl,
        files: [file],
      };
      try {
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (e) {}
    }

    // Fallback: open SNS share URL
    const textWithUrl = shareText + "\n" + shareUrl;
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textWithUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    };

    if (urls[sns]) {
      window.open(urls[sns], "_blank", "width=550,height=420");
    }

    // Auto-save image so user can attach
    if (result) {
      const link = document.createElement("a");
      link.download = "my-integrity-result.png";
      link.href = result.canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n" + shareUrl);
      setShowShareTip(true);
      setTimeout(() => setShowShareTip(false), 2500);
    } catch(e) {}
    setShowSnsMenu(false);
  };

  const snsOptions = [
    {
      name: "X (Twitter)",
      color: "#000000",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      action: () => handleShareWithImage("x"),
    },
    {
      name: "Facebook",
      color: "#1877F2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: () => handleShareWithImage("facebook"),
    },
    {
      name: "LINE",
      color: "#06C755",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      ),
      action: () => handleShareWithImage("line"),
    },
    {
      name: "コピー",
      color: "#6b4423",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      ),
      action: handleCopyText,
    },
  ];

  const handleShare = () => {
    setShowSnsMenu(!showSnsMenu);
  };

  return (
    <FadeIn>
      {/* Share Card - Designed for screenshots */}
      <div ref={shareCardRef} style={{
        background: "linear-gradient(160deg, #4a2f14 0%, #6b4423 40%, #7a5230 70%, #3d2410 100%)",
        borderRadius: "24px",
        padding: "36px 24px 32px",
        marginBottom: "20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(74,47,20,0.4)",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: -30,
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
        }} />

        <FadeIn delay={200}>
          <div style={{
            fontSize: "10px", letterSpacing: "0.25em",
            color: "rgba(232,213,183,0.5)", marginBottom: "6px",
            fontWeight: 600,
          }}>MY INTEGRITY</div>
          <h2 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "clamp(20px, 4.5vw, 26px)",
            fontWeight: 700, color: "#e8d5b7",
            marginBottom: "4px",
          }}>あなたのインテグリティ</h2>
          <p style={{
            fontSize: "12px", color: "rgba(232,213,183,0.45)",
            letterSpacing: "0.15em", marginBottom: "28px",
          }}>— 核となる3つの価値観 —</p>
        </FadeIn>

        <div style={{
          display: "flex", gap: "10px", justifyContent: "center",
          flexWrap: "wrap", marginBottom: "8px",
        }}>
          {finalThree.map((id, i) => {
            const v = ALL_VALUES.find(val => val.id === id);
            const medals = ["🥇", "🥈", "🥉"];
            const sizes = [{ fs: "28px", p: "22px 24px" }, { fs: "24px", p: "18px 22px" }, { fs: "24px", p: "18px 22px" }];
            return (
              <FadeIn key={id} delay={500 + i * 350}>
                <div style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(232,213,183,0.15)",
                  backdropFilter: "blur(4px)",
                  padding: sizes[i].p,
                  borderRadius: "18px",
                  minWidth: i === 0 ? "130px" : "110px",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>{medals[i]}</div>
                  <div style={{
                    fontSize: sizes[i].fs, fontWeight: 700,
                    fontFamily: "'Noto Serif JP', serif",
                    color: "#e8d5b7",
                    marginBottom: "3px",
                  }}>{v?.label}</div>
                  <div style={{ fontSize: "10px", color: "rgba(232,213,183,0.45)" }}>{v?.desc}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={1600}>
          <div style={{
            marginTop: "20px", paddingTop: "16px",
            borderTop: "1px solid rgba(232,213,183,0.08)",
          }}>
            <div style={{
              fontSize: "10px", color: "rgba(232,213,183,0.3)",
              letterSpacing: "0.2em",
            }}>◇ My Integrity ◇</div>
          </div>
        </FadeIn>
      </div>

      {/* Share button & SNS menu */}
      <FadeIn delay={1800}>
        <div style={{ textAlign: "center", marginBottom: "24px", position: "relative" }}>
          {/* Save Image Button */}
          <button onClick={handleSaveImage} disabled={isGenerating} style={{
            background: "linear-gradient(135deg, #5c3d1e, #7a5230)",
            color: "#e8d5b7",
            border: "none", borderRadius: "60px",
            padding: "13px 28px",
            fontSize: "13px", fontWeight: 600,
            cursor: isGenerating ? "wait" : "pointer",
            boxShadow: "0 4px 16px rgba(92,61,30,0.3)",
            display: "inline-flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s",
            marginBottom: "10px",
            opacity: isGenerating ? 0.7 : 1,
          }}
          onMouseOver={e => { if (!isGenerating) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(92,61,30,0.4)"; }}}
          onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(92,61,30,0.3)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            {isGenerating ? "画像を作成中..." : "📸 結果画像を保存する"}
          </button>

          <br />

          {/* Share to SNS Button */}
          <button onClick={handleShare} style={{
            background: "transparent",
            color: "#6b4423",
            border: "1.5px solid #6b4423",
            borderRadius: "60px",
            padding: "11px 28px",
            fontSize: "13px", fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(107,68,35,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = ""; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            SNSでシェアする
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{
              transform: showSnsMenu ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
            </svg>
          </button>

          {/* SNS Selection Panel */}
          {showSnsMenu && (
            <div style={{
              marginTop: "12px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "12px",
              boxShadow: "0 8px 32px rgba(74,47,20,0.15)",
              border: "1px solid rgba(74,47,20,0.08)",
              animation: "snsMenuIn 0.25s ease",
            }}>
              <p style={{ fontSize: "11px", color: "#999", marginBottom: "10px" }}>
                💡 画像を保存済みの場合、投稿時に添付できます
              </p>
              <div style={{
                display: "flex",
                gap: "6px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
                {snsOptions.map((sns) => (
                  <button
                    key={sns.name}
                    onClick={sns.action}
                    disabled={isGenerating}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "transparent",
                      border: "1px solid rgba(74,47,20,0.1)",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      fontSize: "12px", fontWeight: 600,
                      color: sns.color,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = `${sns.color}12`;
                      e.currentTarget.style.borderColor = `${sns.color}30`;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(74,47,20,0.1)";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    {sns.icon}
                    {sns.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <style>{`
            @keyframes snsMenuIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(4px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
          `}</style>

          {showShareTip && (
            <div style={{
              position: "absolute", bottom: "-30px", left: "50%",
              transform: "translateX(-50%)",
              background: "#2d6a4f", color: "#fff",
              padding: "6px 16px", borderRadius: "8px",
              fontSize: "12px", fontWeight: 500,
              animation: "fadeInUp 0.3s ease",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}>✓ テキストをコピーしました</div>
          )}
        </div>
      </FadeIn>

      {/* Define your values */}
      <FadeIn delay={2000}>
        <div style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "16px",
          border: "1px solid rgba(255,255,255,0.5)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: 4, height: "100%",
            background: "linear-gradient(180deg, #d4a853, #c49b3d)",
          }} />
          <h3 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "15px", fontWeight: 700, color: "#4a2f14",
            marginBottom: "10px",
          }}>📝 価値観の定義を書く</h3>
          <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.8, marginBottom: "16px" }}>
            具体的な行動として定義してみましょう。<br />
            「私にとっての〇〇とは、△△することである」
          </p>
          {finalThree.map(id => {
            const v = ALL_VALUES.find(val => val.id === id);
            return (
              <div key={id} style={{ marginBottom: "12px" }}>
                <label style={{
                  fontSize: "13px", fontWeight: 600, color: "#4a2f14",
                  display: "block", marginBottom: "6px",
                }}>「{v?.label}」とは：</label>
                <input type="text"
                  value={definitions[id] || ""}
                  onChange={e => setDefinitions({ ...definitions, [id]: e.target.value })}
                  placeholder={`私にとっての${v?.label}とは、...`}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "12px 14px",
                    border: "1.5px solid #e8e2d8",
                    borderRadius: "12px",
                    fontSize: "13px", fontFamily: "inherit",
                    outline: "none", background: "rgba(255,255,255,0.5)",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#d4a853"}
                  onBlur={e => e.target.style.borderColor = "#e8e2d8"}
                />
              </div>
            );
          })}
        </div>
      </FadeIn>

      {/* Episodes */}
      {episodes.best && (
        <FadeIn delay={2200}>
          <div style={{
            background: "rgba(255,255,255,0.55)", borderRadius: "16px",
            padding: "18px 20px", marginBottom: "12px",
            border: "1px solid rgba(255,255,255,0.4)",
          }}>
            <h4 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "14px", color: "#4a2f14", marginBottom: "6px",
            }}>✨ あなたの最高の瞬間</h4>
            <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, margin: 0 }}>{episodes.best}</p>
          </div>
        </FadeIn>
      )}
      {episodes.anger && (
        <FadeIn delay={2400}>
          <div style={{
            background: "rgba(255,255,255,0.55)", borderRadius: "16px",
            padding: "18px 20px", marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.4)",
          }}>
            <h4 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "14px", color: "#4a2f14", marginBottom: "6px",
            }}>🔥 あなたの最高の怒り</h4>
            <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.9, margin: 0 }}>{episodes.anger}</p>
          </div>
        </FadeIn>
      )}

      {/* Decision filter */}
      <FadeIn delay={2600}>
        <div style={{
          background: "linear-gradient(135deg, rgba(74,47,20,0.04), rgba(30,27,75,0.04))",
          borderRadius: "18px",
          padding: "22px 24px",
          marginBottom: "28px",
          border: "1px solid rgba(74,47,20,0.06)",
        }}>
          <h4 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: "14px", color: "#4a2f14", marginBottom: "10px",
          }}>🧭 意思決定のフィルター</h4>
          <p style={{ fontSize: "13px", color: "#555", lineHeight: 2, margin: 0 }}>
            迷った時にこう自問してください：
          </p>
          <div style={{
            marginTop: "10px",
            background: "rgba(212,168,83,0.1)",
            borderRadius: "12px",
            padding: "14px 18px",
            border: "1px solid rgba(212,168,83,0.15)",
          }}>
            <p style={{
              fontSize: "14px", fontWeight: 600,
              color: "#4a2f14", lineHeight: 1.9, margin: 0,
              fontFamily: "'Noto Serif JP', serif",
            }}>
              「この選択は、私の核となる<br />
              <span style={{
                background: "linear-gradient(transparent 60%, rgba(212,168,83,0.25) 60%)",
                padding: "0 2px",
              }}>{threeLabels}</span><br />
              に沿っているか？」
            </p>
          </div>
        </div>
      </FadeIn>

      <div style={{ textAlign: "center", padding: "6px 0 24px" }}>
        <GhostBtn onClick={onRestart}>もう一度やり直す</GhostBtn>
      </div>
    </FadeIn>
  );
}

/* ─── Main App ─── */
export default function MyIntegrityApp() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [episodes, setEpisodes] = useState({ best: "", anger: "" });
  const [finalThree, setFinalThree] = useState([]);
  const containerRef = useRef(null);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f5ede2 0%, #f0e6d8 40%, #ecddc8 100%)",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <FloatingParticles />

      <div ref={containerRef} style={{
        maxWidth: "520px",
        margin: "0 auto",
        padding: "12px 18px 48px",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        overflowX: "hidden",
        boxSizing: "border-box",
      }}>
        {step > 0 && step < 4 && <StepIndicator currentStep={step} />}

        {step === 0 && <IntroScreen onStart={() => { setStep(1); scrollTop(); }} />}

        {step === 1 && (
          <ValueSelection
            selected={selected}
            setSelected={setSelected}
            onNext={() => { setStep(2); scrollTop(); }}
          />
        )}

        {step === 2 && (
          <EpisodeAnalysis
            selected={selected}
            episodes={episodes}
            setEpisodes={setEpisodes}
            onNext={() => { setStep(3); scrollTop(); }}
            onBack={() => { setStep(1); scrollTop(); }}
          />
        )}

        {step === 3 && (
          <Tournament
            selected={selected}
            onComplete={(three) => { setFinalThree(three); setStep(4); scrollTop(); }}
            onBack={() => { setStep(1); scrollTop(); }}
          />
        )}

        {step === 4 && (
          <Results
            finalThree={finalThree}
            episodes={episodes}
            onRestart={() => {
              setStep(0); setSelected([]); setEpisodes({ best: "", anger: "" });
              setFinalThree([]); scrollTop();
            }}
          />
        )}
      </div>
    </div>
  );
}
