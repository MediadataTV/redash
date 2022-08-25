from jinja2 import Environment, BaseLoader, contextfilter
from jinja2.runtime import Context
import pandas


@contextfilter
def _j2_alert_table_filter(ctxt: Context, dict_list):
    filter_out = ''
    results = 50
    render_html = ctxt.get('render_html', False)
    skip_rendering = ctxt.get('skip_tables', False)

    if skip_rendering is False and dict_list and len(dict_list) > 0:

        dict_df = dict_list[:results]
        df = pandas.DataFrame.from_dict(dict_df).reset_index(drop=True)
        caption = '(Table sample is limited to {} results)'.format(results)
        if render_html:
            filter_out = "<legend>{}</legend>".format(caption) + df.to_html(index=False, border=0,
                                                                            table_id="alert_table", render_links=True
                                                                            )
        else:
            filter_out = "{}\n\n".format(caption) + df.to_markdown(index=False)

    return filter_out


def _j2_alert_status_icon(alert_status: str):
    icon_map = {"ok": '\U00002705', "triggered": '\U0001F6A8', "unknown": "\U00002753"}
    return icon_map.get(alert_status.lower())


def register_filters() -> Environment:
    env = Environment(loader=BaseLoader())
    env.filters["alert_table"] = _j2_alert_table_filter
    env.filters["alert_status_icon"] = _j2_alert_status_icon
    return env
