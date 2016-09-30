#! /usr/bin/env ruby

res = `man #{ARGV[0]} | col -b`

use = ['NAME', 'DESCRIPTION']


flag = false
lines = []

output = []
output.push 'include ../man'
output.push '  dl'

res.split("\n").each do |line|
  if line.length == 0 and flag
    if lines.length > 0
      if lines.length == 1
        output.push '    dd ' + lines[0]
      else
        output.push '    dd'
        lines[0...-1].each do |l|
          output.push '      | ' + l + (l.end_with?('-') ? '' : ' ')
        end
        output.push '      | ' + lines[-1]
      end
      # output.push '    dd: span.skip'
      output.push ''
    end
    lines.clear
  elsif not line.start_with?('  ') and not line.start_with?("\t")
    if use.include?(line)
      flag = true
      output.push '    dt ' + line
    else
      flag = false
    end
  else
    if line.end_with? ':' and ['The', 'follow', 'option'].all?{ |word| line.include? word }
      break
    elsif flag
      lines.push(line.lstrip)
    end
  end
end

# if output[-2].end_with?('dd: span.skip')
#   output.pop(2)
# end
output.each do |l|
  puts l
end
