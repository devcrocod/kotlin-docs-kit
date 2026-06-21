{{- /* Plain-markdown twin of a section landing page (MD output format).
       .RenderShortcodes so the landing's card grids / hero render to HTML
       rather than leaking raw shortcode syntax; see single.md. */ -}}
{{- printf "# %s\n\n" .Title -}}
{{- with .Description }}{{- printf "%s\n\n" . -}}{{- end -}}
{{- .RenderShortcodes -}}
