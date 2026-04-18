export default function MilestoneBar({ milestones, currentAge, retireAge }) {
  if (!milestones?.length) return null

  const totalYears = retireAge - currentAge

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-5 flex items-center gap-2">
        <span className="text-xl">🏁</span>
        里程碑时间线
      </h3>

      {/* 进度条 */}
      <div className="relative mb-8">
        {/* 背景轨道 */}
        <div className="h-2 bg-warm-border rounded-full w-full" />

        {/* 填充渐变 */}
        <div
          className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-warm-primary via-warm-gold to-warm-accent"
          style={{ width: '100%' }}
        />

        {/* 里程碑节点 */}
        {milestones.map((ms, idx) => {
          const leftPercent = totalYears > 0
            ? ((ms.age - currentAge) / totalYears) * 100
            : 0

          return (
            <div
              key={idx}
              className="absolute -top-1 flex flex-col items-center"
              style={{
                left: `${Math.min(Math.max(leftPercent, 0), 100)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {/* 节点圆点 */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                  ms.percent === 100
                    ? 'bg-warm-accent'
                    : ms.percent === 0
                    ? 'bg-warm-primary'
                    : 'bg-warm-gold'
                }`}
              />

              {/* 标签 */}
              <div className="mt-3 text-center">
                <div className="text-xs font-semibold text-warm-dark">
                  {ms.label}
                </div>
                <div className="text-[10px] text-warm-muted mt-0.5">
                  {Number.isFinite(ms.age) ? `${Math.round(ms.age)} 岁` : '--'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 里程碑详情卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-10">
        {milestones.map((ms, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3 text-center border ${
              ms.percent === 100
                ? 'bg-warm-accent/10 border-warm-accent/20'
                : ms.percent === 0
                ? 'bg-warm-primary/10 border-warm-primary/20'
                : 'bg-warm-gold/10 border-warm-gold/20'
            }`}
          >
            <div className="text-lg font-bold text-warm-dark">{ms.label}</div>
            <div className="text-xs text-warm-muted mt-1">
              {Number.isFinite(ms.age) ? `${Math.round(ms.age)} 岁` : '--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
