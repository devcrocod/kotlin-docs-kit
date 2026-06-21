{{- /* Plain-markdown twin of the page (MD output format) for AI consumption.
       .RenderShortcodes (not .RawContent) so live shortcodes — callouts, cards,
       tabs — render to their HTML instead of leaking raw shortcode syntax;
       prose and fenced code stay as Markdown. Escaped examples stay literal. */ -}}
{{- printf "# %s\n\n" .Title -}}
{{- with .Description }}{{- printf "%s\n\n" . -}}{{- end -}}
{{- .RenderShortcodes -}}
