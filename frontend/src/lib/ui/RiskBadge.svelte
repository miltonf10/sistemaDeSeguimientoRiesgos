<script lang="ts">
  let { level = '', size = 'sm' as 'sm' | 'md' | 'lg', class: className = '' }: { level: string; size?: 'sm' | 'md' | 'lg'; class?: string } = $props();

  const styles: Record<string, string> = {
    Alto: 'bg-red-50 text-red-700 border-red-200',
    Medio: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Baja: 'bg-green-50 text-green-700 border-green-200',
    Bajo: 'bg-green-50 text-green-700 border-green-200',
    Media: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Alta: 'bg-red-50 text-red-700 border-red-200',
  };

  const dots: Record<string, string> = {
    Alto: '#EB5757',
    Medio: '#F2C94C',
    Baja: '#27AE60',
    Bajo: '#27AE60',
    Media: '#F2C94C',
    Alta: '#EB5757',
  };

  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1', lg: 'text-base px-3 py-1.5' };
</script>

<span class="inline-flex items-center gap-1.5 font-medium rounded-full border {sizes[size]} {styles[level] || 'bg-gray-50 text-gray-600 border-gray-200'} {className}">
  {#if dots[level]}
    <span class="w-2 h-2 rounded-full" style="background-color: {dots[level]}"></span>
  {/if}
  {level || 'Sin clasificar'}
</span>
