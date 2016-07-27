from reportlab.pdfgen import canvas
from reportlab.lib.units import cm, inch
import math

document_width = 8.5 * inch
document_height = 11 * inch

margin_top = 0.25 * inch
margin_left = 0.25 * inch

slant_angle = 90

vertical_spacing = 0.38 * cm
horizontal_spacing = 0.38 * cm * 4

slant_angle_rad = math.radians(slant_angle)

c = canvas.Canvas("grid.pdf", pagesize=(document_width, document_height))
c.setLineWidth(0)
c.setStrokeColorRGB(0.5, 0.5, 0.5)

working_width = document_width - margin_left * 2
working_height = document_height - margin_top * 2
rows = int(math.ceil(working_height / vertical_spacing))
working_height = (rows - 1) * vertical_spacing

c.translate(margin_left, margin_top)

# Draw the rows
for y in xrange(rows):
    c.line(0, y * vertical_spacing, working_width, y * vertical_spacing)

# Draw a containing box
c.line(0, 0, 0, working_height)
c.line(working_width, 0, working_width, working_height)


def get_slant_end_pos(start_x, start_y):
    remaining_width = working_width - start_x
    remaining_height = working_height - start_y

    width = remaining_height / math.tan(slant_angle_rad)
    height = remaining_width * math.tan(slant_angle_rad)

    if width > remaining_width:
        width = remaining_width
    if height > remaining_height:
        height = remaining_height

    return (start_x + width, start_y + height)

# Draw diagonals from the bottom of the page
cols = int(math.ceil(working_width / horizontal_spacing))
for x in xrange(1, cols):
    x_pos = x * horizontal_spacing
    end_pos = get_slant_end_pos(x_pos, 0)
    c.line(x_pos, 0, *end_pos)

if slant_angle < 90:
    # Draw diagonals from the left of the page
    diagonal_vertical_spacing = horizontal_spacing * math.tan(slant_angle_rad)
    count = int(math.ceil(working_height / diagonal_vertical_spacing))
    for y in xrange(count):
        y_offset = y * diagonal_vertical_spacing
        end_pos = get_slant_end_pos(0, y_offset)
        c.line(0, y_offset, *end_pos)


c.save()
