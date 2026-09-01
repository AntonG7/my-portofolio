import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

cities = ["MARSEILLE", "NICE", "PARIS", "NANTES", "DIJON"]
counts = [16, 10, 9, 8, 7]
colors = ["#7f7fd5", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

fig, ax = plt.subplots(figsize=(9, 5))
bars = ax.barh(cities[::-1], counts[::-1], color=colors[::-1], edgecolor="white", height=0.5)

for bar, count in zip(bars, counts[::-1]):
    ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height() / 2,
            str(count), va="center", fontsize=12, fontweight="bold", color="#333")

ax.set_xlabel("Nombre d'occurrences", fontsize=11)
ax.set_title("Top 5 des villes — COPYOFRD_REGLES_METIERS_V2\nresult_valo_stock_20240531",
             fontsize=12, fontweight="bold", pad=15)
ax.set_xlim(0, 20)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.tick_params(axis="y", labelsize=12)

plt.tight_layout()
plt.savefig("/Users/anthonyguignard/Desktop/mon-portfolio/villes_distribution.png", dpi=150)
plt.show()
