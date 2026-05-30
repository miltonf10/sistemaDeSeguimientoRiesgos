<script lang="ts">
  import { lucideIconMap } from './lucide-icon-map';

  interface Props {
    name: string;
    class?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
    absoluteStrokeWidth?: boolean;
    [key: string]: unknown;
  }

  let { name, class: className = '', size = 24, strokeWidth = 2, color = 'currentColor', absoluteStrokeWidth = false, ...rest }: Props = $props();

  function sw() {
    return absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth;
  }

  const IconComponent = $derived(lucideIconMap[name.toLowerCase()]);
</script>

{#if IconComponent}
  <IconComponent class={className} {size} strokeWidth={sw()} {color} {...rest} />
{/if}
