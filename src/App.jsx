import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Plus, Link2, Camera, ChevronLeft, Sparkles,
  ShoppingBag, X, Check, ExternalLink, LogOut, Trash2,
} from "lucide-react";

const C = {
  bg: "#fef2f8", surface: "#ffffff", surfaceAlt: "#fff8fb",
  primary: "#c9668f", primaryDeep: "#a84b73",
  text: "#3d2b35", textMuted: "#a98a9a",
  border: "#f3d7e4", tagBg: "#f9e4ee", ok: "#7f9c7a", okBg: "#e9f1e6",
};

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const TYPES = ["T-shirt", "Hoodie", "Jean", "Sneakers", "Sac", "Beauté", "Talons", "Autre"];
const labelStyle = { display: "block", fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 };
const inputStyle = { width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", fontFamily: "'Manrope', sans-serif", fontSize: 13, color: C.text, outline: "none" };

// ---------------------------------------------------------------------------
// AUTHENTIFICATION
// ---------------------------------------------------------------------------

function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fn = mode === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else if (mode === "signup") setError("Compte créé ! Vérifie ta boîte mail pour confirmer, puis connecte-toi.");
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f2e4ec", fontFamily: "'Manrope', sans-serif" }}>
      <style>{fontImport}</style>
      <form onSubmit={handleSubmit} style={{ width: 340, background: C.bg, borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(168,75,115,0.18)" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: C.text, marginBottom: 4 }}>🏷️ Tagged</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 22 }}>
          {mode === "login" ? "Contente de te revoir." : "Crée ton compte."}
        </div>

        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }} required />

        <label style={labelStyle}>Mot de passe</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 18 }} required minLength={6} />

        {error && <div style={{ fontSize: 12, color: C.primaryDeep, marginBottom: 14 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 14, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 12 }}>
          {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ width: "100%", background: "none", border: "none", color: C.primaryDeep, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PETITS COMPOSANTS
// ---------------------------------------------------------------------------

function PriceTag({ value }) {
  return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.primaryDeep, fontWeight: 500 }}>{value ?? 0}$</span>;
}

function StatusDot({ statut }) {
  const acheté = statut === "acheté";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, textTransform: "uppercase", color: acheté ? C.ok : C.textMuted, background: acheté ? C.okBg : C.tagBg, padding: "3px 7px", borderRadius: 20 }}>
      {acheté && <Check size={10} strokeWidth={3} />}{acheté ? "Acheté" : "À acheter"}
    </span>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flexShrink: 0, fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 20, border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primary : C.surface, color: active ? "#fff" : C.textMuted, cursor: "pointer", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}

function ProductCard({ p, onOpen, onToggleStatut, onDelete }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      <div onClick={() => onOpen(p)} style={{ height: 96, borderRadius: 12, background: C.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, cursor: "pointer", overflow: "hidden" }}>
        {p.image_url ? <img src={p.image_url} alt={p.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🏷️"}
      </div>
      <div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{p.marque || "—"}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: C.text, fontWeight: 500 }}>{p.nom}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <PriceTag value={p.prix} />
        <button onClick={() => onToggleStatut(p)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <StatusDot statut={p.statut} />
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: -2 }}>
        {p.url && (
          <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: C.primaryDeep, display: "flex", alignItems: "center", gap: 3, textDecoration: "none" }}>
            Ouvrir <ExternalLink size={11} />
          </a>
        )}
        <button onClick={() => onDelete(p)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", marginLeft: "auto" }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FORMULAIRE D'AJOUT
// ---------------------------------------------------------------------------

function AddScreen({ userId, categories, defaultCategoryId, onClose, onSaved }) {
  const [nom, setNom] = useState("");
  const [marque, setMarque] = useState("");
  const [prix, setPrix] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId || (categories[0]?.id ?? ""));
  const [isVetement, setIsVetement] = useState(true);
  const [taille, setTaille] = useState("");
  const [couleur, setCouleur] = useState("");
  const [paidBy, setPaidBy] = useState("Moi");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!nom || !categoryId) { setError("Donne au moins un nom et une collection."); return; }
    setSaving(true);
    setError("");

    let image_url = null;
    if (file) {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
      if (!upErr) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
    }

    const { error: insErr } = await supabase.from("products").insert({
      user_id: userId,
      category_id: categoryId,
      type: type || null,
      is_vetement: isVetement,
      nom, marque, prix: prix ? Number(prix) : null, url: url || null,
      taille: isVetement ? taille : null,
      couleur: isVetement ? couleur : null,
      paid_by: paidBy,
      notes: notes || null,
      image_url,
      statut: "à acheter",
    });

    setSaving(false);
    if (insErr) { setError(insErr.message); return; }
    onSaved();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(61,43,53,0.35)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
      <div style={{ background: C.bg, width: "100%", maxWidth: 420, margin: "0 auto", maxHeight: "92vh", overflowY: "auto", borderRadius: "24px 24px 0 0", padding: "18px 18px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: C.text }}>Ajouter un article</span>
          <button onClick={onClose} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, width: 32, height: 32, cursor: "pointer" }}><X size={16} color={C.text} /></button>
        </div>

        <label style={labelStyle}>Photo</label>
        <label style={{ height: 110, borderRadius: 16, border: `1.5px dashed ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14, color: C.textMuted, cursor: "pointer" }}>
          <Camera size={20} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 600 }}>{file ? file.name : "Choisir une photo"}</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
        </label>

        <label style={labelStyle}>Lien du produit</label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 14 }}>
          <Link2 size={15} color={C.textMuted} />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: C.text, width: "100%", fontFamily: "'Manrope', sans-serif" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div><label style={labelStyle}>Nom *</label><input value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Marque</label><input value={marque} onChange={(e) => setMarque(e.target.value)} style={inputStyle} /></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div><label style={labelStyle}>Prix</label><input value={prix} onChange={(e) => setPrix(e.target.value)} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
              <option value="">Choisir...</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <label style={labelStyle}>Collection *</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nom}</option>)}
        </select>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>C'est un vêtement</label>
          <button onClick={() => setIsVetement(!isVetement)} style={{ width: 42, height: 24, borderRadius: 20, background: isVetement ? C.primary : C.border, position: "relative", border: "none", cursor: "pointer" }}>
            <span style={{ position: "absolute", top: 3, left: isVetement ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
          </button>
        </div>

        {isVetement && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div><label style={labelStyle}>Taille</label><input value={taille} onChange={(e) => setTaille(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Couleur</label><input value={couleur} onChange={(e) => setCouleur(e.target.value)} style={inputStyle} /></div>
          </div>
        )}

        <label style={labelStyle}>Payé par</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["Moi", "Parents", "Autre"].map((v) => <Chip key={v} label={v} active={paidBy === v} onClick={() => setPaidBy(v)} />)}
        </div>

        <label style={labelStyle}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none", marginBottom: 14, fontFamily: "'Manrope', sans-serif" }} />

        {error && <div style={{ fontSize: 12, color: C.primaryDeep, marginBottom: 12 }}>{error}</div>}

        <button onClick={handleSave} disabled={saving} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FORMULAIRE NOUVELLE COLLECTION
// ---------------------------------------------------------------------------

function NewCategoryForm({ userId, onClose, onSaved }) {
  const [nom, setNom] = useState("");
  const [emoji, setEmoji] = useState("🏷️");
  const [budget, setBudget] = useState("");

  async function save() {
    if (!nom) return;
    await supabase.from("categories").insert({ user_id: userId, nom, emoji, budget: budget ? Number(budget) : null });
    onSaved();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(61,43,53,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: C.bg, width: 320, borderRadius: 20, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: C.text }}>Nouvelle collection</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={C.text} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} style={{ ...inputStyle, width: 50, textAlign: "center" }} />
          <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom (ex: Back to school)" style={inputStyle} />
        </div>
        <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget en $ (optionnel)" style={{ ...inputStyle, marginBottom: 14 }} />
        <button onClick={save} style={{ width: "100%", background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>Créer</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// APP PRINCIPALE
// ---------------------------------------------------------------------------

export default function App() {
  const [session, setSession] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState({ screen: "home" });
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [showAdd, setShowAdd] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadData() {
    const { data: cats } = await supabase.from("categories").select("*").order("created_at");
    const { data: prods } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setCategories(cats || []);
    setProducts(prods || []);
  }

  useEffect(() => { if (session) loadData(); }, [session]);

  if (session === undefined) return null;
  if (!session) return <AuthScreen />;

  const userId = session.user.id;

  async function toggleStatut(p) {
    const statut = p.statut === "acheté" ? "à acheter" : "acheté";
    await supabase.from("products").update({ statut }).eq("id", p.id);
    loadData();
  }

  async function deleteProduct(p) {
    await supabase.from("products").delete().eq("id", p.id);
    loadData();
  }

  const filteredProducts = typeFilter === "Tous" ? products : products.filter((p) => p.type === typeFilter);
  const currentCategory = view.screen === "collection" ? categories.find((c) => c.id === view.categoryId) : null;
  const categoryProducts = currentCategory ? products.filter((p) => p.category_id === currentCategory.id) : [];

  return (
    <div style={{ display: "flex", justifyContent: "center", background: "#f2e4ec", minHeight: "100vh", padding: "24px 0", fontFamily: "'Manrope', sans-serif" }}>
      <style>{fontImport}</style>
      <div style={{ width: 390, minHeight: 760, background: C.bg, borderRadius: 32, boxShadow: "0 20px 60px rgba(168,75,115,0.18)", position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", overflowY: "auto" }}>

          {view.screen === "home" && (
            <div style={{ padding: "20px 18px 100px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Bon retour ✨</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: C.text, fontWeight: 600 }}>Ta wishlist</div>
                </div>
                <button onClick={() => supabase.auth.signOut()} style={{ width: 40, height: 40, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  <LogOut size={16} color={C.primaryDeep} />
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 2 }}>
                <Chip label="Tous" active={typeFilter === "Tous"} onClick={() => setTypeFilter("Tous")} />
                {TYPES.map((t) => <Chip key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />)}
              </div>

              {typeFilter !== "Tous" ? (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", marginBottom: 12 }}>{typeFilter} — toutes collections</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {filteredProducts.map((p) => <ProductCard key={p.id} p={p} onOpen={() => {}} onToggleStatut={toggleStatut} onDelete={deleteProduct} />)}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>Mes collections</span>
                    <button onClick={() => setShowNewCat(true)} style={{ background: "none", border: "none", color: C.primaryDeep, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Nouvelle</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {categories.map((c) => {
                      const items = products.filter((p) => p.category_id === c.id);
                      const depense = items.filter((p) => p.statut === "acheté").reduce((s, p) => s + Number(p.prix || 0), 0);
                      return (
                        <button key={c.id} onClick={() => setView({ screen: "collection", categoryId: c.id })} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, textAlign: "left", cursor: "pointer" }}>
                          <div style={{ fontSize: 26, marginBottom: 8 }}>{c.emoji}</div>
                          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: C.text, fontWeight: 500 }}>{c.nom}</div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{items.length} article{items.length > 1 ? "s" : ""}</div>
                          {c.budget && (
                            <div style={{ marginTop: 12 }}>
                              <div style={{ height: 4, borderRadius: 4, background: C.tagBg, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min(100, (depense / c.budget) * 100)}%`, background: C.primary }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }}>
                                <span style={{ color: C.primaryDeep }}>{depense}$</span><span style={{ color: C.textMuted }}>/ {c.budget}$</span>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {categories.length === 0 && (
                      <div style={{ gridColumn: "1/3", textAlign: "center", color: C.textMuted, fontSize: 13, padding: "30px 0" }}>
                        Aucune collection pour l'instant.<br />Crée-en une pour commencer.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {view.screen === "collection" && currentCategory && (
            <div style={{ padding: "20px 18px 100px" }}>
              <button onClick={() => setView({ screen: "home" })} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.primaryDeep, fontWeight: 600, fontSize: 13, marginBottom: 16, cursor: "pointer" }}>
                <ChevronLeft size={16} /> Retour
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 24 }}>{currentCategory.emoji}</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: C.text }}>{currentCategory.nom}</span>
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{categoryProducts.length} article{categoryProducts.length > 1 ? "s" : ""}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {categoryProducts.map((p) => <ProductCard key={p.id} p={p} onOpen={() => {}} onToggleStatut={toggleStatut} onDelete={deleteProduct} />)}
                {categoryProducts.length === 0 && <div style={{ gridColumn: "1/3", textAlign: "center", color: C.textMuted, fontSize: 13, padding: "30px 0" }}>Vide pour l'instant.</div>}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(254,242,248,0.9)", backdropFilter: "blur(8px)", borderTop: `1px solid ${C.border}`, padding: "12px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setView({ screen: "home" })} style={{ background: "none", border: "none", cursor: "pointer", color: view.screen === "home" ? C.primaryDeep : C.textMuted }}><ShoppingBag size={20} /></button>
          <button onClick={() => setShowAdd(true)} style={{ width: 52, height: 52, borderRadius: "50%", background: C.primary, border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(201,102,143,0.4)", cursor: "pointer", marginTop: -28 }}>
            <Plus size={24} color="#fff" strokeWidth={2.5} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><Search size={20} /></button>
        </div>

        {showAdd && categories.length > 0 && (
          <AddScreen userId={userId} categories={categories} defaultCategoryId={currentCategory?.id} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); loadData(); }} />
        )}
        {showAdd && categories.length === 0 && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(61,43,53,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowAdd(false)}>
            <div style={{ background: C.bg, padding: 20, borderRadius: 16, color: C.text, fontSize: 13, maxWidth: 260, textAlign: "center" }}>Crée d'abord une collection avant d'ajouter un article.</div>
          </div>
        )}
        {showNewCat && <NewCategoryForm userId={userId} onClose={() => setShowNewCat(false)} onSaved={() => { setShowNewCat(false); loadData(); }} />}
      </div>
    </div>
  );
}
